import { Injectable, Logger, BadRequestException } from '@nestjs/common';
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
        let roomName = '';

        return new Promise((resolve: Function, reject: Function) => {
            xmppService.client.muc.createAnonRoom(user.email).subscribe({
                // The last value it will return here is the roomName.
                // if you just reset the variable everytime it should
                // be left with the very last one, which should be correct.
                // know it is gross, but can't think of a better way.
                next: (data: string) => roomName = data,
                error: (error: any) => {
                    Logger.error({ error: error, message: 'Error occured while creating room'});
                    reject({error: error, message: 'Failed to create room'});
                },
                complete: async () => {
                    const room: Room = <Room> {
                        roomName: roomName,
                        user: user
                    };
    
                    await this.roomRepository.save(room);
    
                    Logger.log(`Room created - ${roomName}`);
    
                    resolve(room);
                }
            });
        });
    }

    async delete(roomName: string, email: string): Promise<any> {
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
                                resolve({message: `${roomName} belong to ${email} has been destroyed`});    
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