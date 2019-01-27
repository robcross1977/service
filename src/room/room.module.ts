import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'bearer' }),
    ],
    providers: [RoomService],
    controllers: [RoomController]
})
export class RoomModule {}
