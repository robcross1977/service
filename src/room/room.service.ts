import { Injectable, Logger } from '@nestjs/common';
import { xmppService } from '../xmpp/xmpp.service';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository, IsNull } from 'typeorm';
import * as moment from 'moment';

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
        return await this.roomRepository.find({
            where: {
                userEmail: email,
                deletedAt: IsNull()
            }
        });
    }

    async delete(rooms: string, email: string): Promise<any> {
        const deletions = [];

        return new Promise(async (resolve, reject) => {
            Promise.all([...rooms.split(',')].map(async room => {
                try {
                    await this.deleteRoom(room, email).then(ret => {
                        deletions.push(ret)
                    });
                } catch(e) {
                    deletions.push(e);
                }
            })).then(() => {
                resolve(deletions);
            });
        });
    }

    async deleteRoom(roomName: string, email: string): Promise<any> {
        const userOwnsRoom = await this.userOwnsRoom(roomName, email);

        return new Promise(async (resolve, reject) => {
            if(roomName && userOwnsRoom) {
                xmppService.client.muc.destroyRoom(roomName).subscribe({
                    next: () => {},
                    error: error => {
                        Logger.error({ error: error }, 'error occurred destroying room');
                        reject({error: error, message: 'failed to destroy room'})
                    },
                    complete: async () => {
                        try {
                            const room = await this.roomRepository.findOne({roomName: roomName});
                            room.deletedAt = moment().toDate();
                            await this.roomRepository.save(room);

                            Logger.log({ roomName: roomName }, 'room destroyed');
                            resolve({message: `${roomName} belonging to ${email} has been destroyed`});    
                        } catch(e) {
                            Logger.log(`failed to delete room ${roomName } from db`);
                        }
                    }
                });
            } else {
                const error = <Error>{ name: 'RoomCreateError', message: `failed to destroy room: ${roomName}, please check the name of the room and try again` };
                Logger.error(error);
                reject(error);
            }
        });
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