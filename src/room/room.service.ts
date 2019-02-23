import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Room } from './room.entity';
import { RoomConfig } from './roomConfig';
import { UserInterface } from '../user/user.interface';
import { RoomCreateService } from './room-create.service';
import { RoomDeleteService } from './room-delete.service';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        private readonly roomCreateService: RoomCreateService,
        private readonly roomDeleteService: RoomDeleteService
    ) {}

    async create(user: UserInterface, roomConfig: RoomConfig): Promise<any> {
        return this.roomCreateService.create(user, roomConfig);
    }

    async readAll(email: string) {
        return await this.roomRepository.find({
            where: {
                userEmail: email,
                deletedAt: IsNull()
            }
        });
    }

    async deleteRoom(user: UserInterface, roomName: string) {
        return this.roomDeleteService.delete(user, roomName);
    }
}