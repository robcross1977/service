import { Injectable, Logger } from '@nestjs/common';
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

    async create(user: User) {
        Logger.log('creating a new muc room');
        let roomName = '';

        xmppService.client.muc.createAnonRoom(user.email).subscribe({
            // The last value it will return here is the roomName.
            // if you just reset the variable everytime it should
            // be left with the very last one, which should be correct.
            // know it is gross, but can't think of a better way.
            next: (data: string) => {
                roomName = data
            },
            error: (error: any) => Logger.error({ error: error, message: 'Error occured while creating room'}),
            complete: async () => {
                const room: Room = <Room> {
                    roomName: roomName,
                    user: user
                };

                await this.roomRepository.save(room);

                Logger.log(`Room created - ${roomName}`);
            }
        });
    }
}