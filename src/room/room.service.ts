import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { xmppService } from '../xmpp/xmpp.service';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {}

    async create(user: User): Promise<any> {
        Logger.log('creating a new muc room');

        return new Promise((resolve: Function, reject: Function) => {
            xmppService.client.muc.createAnonRoom(user.email).subscribe({
                next: async (roomName: string) => {
                    const room: Room = <Room> {
                        roomName: roomName,
                        user: user
                    };
    
                    await this.roomRepository.save(room);
    
                    Logger.log(`Room created - ${roomName}`);

                    resolve(room);
                },
                error: (error: any) => {
                    Logger.error({ error: error, message: 'Error occured while creating room'});
                    reject({error: error, message: 'Failed to create room'});
                }
            });
        });
    }

    async readAll(email: string) {
        return await this.roomRepository.find({where: {userEmail: email}});
    }

    async delete(rooms: string, email: string): Promise<any> {
        const deletions = [];

        return new Promise(async (resolve, reject) => {
            Promise.all([...rooms.split(',')].map(async room => {
                await this._deleteRoom(room, email).then(ret => {
                    deletions.push(ret)
                })
            })).then(() => {
                resolve(deletions);
            }).catch(error => {
                reject(error);
            });
        });
    }

    async _deleteRoom(roomName: string, email: string): Promise<any> {
        if(roomName && this.userOwnsRoom(roomName, email)) {
            return new Promise((resolve, reject) => {
                if(roomName) {
                    xmppService.client.muc.destroyRoom(roomName).subscribe({
                        next: () => {},
                        error: error => {
                            Logger.error({ error: error }, 'error occurred destroying room');
                            reject({error: error, message: 'failed to destroy room'})
                        },
                        complete: async () => {
                            try {
                                await this.roomRepository.delete({roomName: roomName});
                                Logger.log({ roomName: roomName }, 'room destroyed');
                                resolve({message: `${roomName} belonging to ${email} has been destroyed`});    
                            } catch(e) {
                                Logger.log('failed to delete room from db');
                                reject({error: 'failed to remove room from database'});
                            }
                        }
                    });
                }
            });
        } else {
            Logger.error('bad request, must provide roomname as first argument and room must belong to user');
            throw new BadRequestException('must include a roomName parameter and room must belong to user');
        }
    }

    async userOwnsRoom(roomName: string, email: string): Promise<boolean> {
        return !!(await this.roomRepository.find({
            where: {
                roomName: roomName,
                email: email
            }
        }));
    }
}