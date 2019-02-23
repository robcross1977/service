
import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';

@Injectable()
export class UserOwnsRoomGuard implements CanActivate {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<any> {
        const request = context.switchToHttp().getRequest();
        const result = await this.roomRepository.find({
            where: {
                roomName: request.params.room,
                user: request.user.email,
                deletedAt: IsNull()
            },
            loadRelationIds: true
        });

        const userOwnsRoom = !!result.length;

        if(!userOwnsRoom) {
            Logger.error({message: "User attempted to delete room that is not owned by the user or does not exist", user: request.user, roomName: request.params.room});
        }

        return userOwnsRoom;
    }
}