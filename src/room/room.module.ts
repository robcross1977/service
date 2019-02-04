import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'bearer' }),
        TypeOrmModule.forFeature([Room]),
    ],
    providers: [
        RoomService
    ],
    controllers: [RoomController]
})
export class RoomModule {}