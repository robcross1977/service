import { Module, HttpModule } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { EjabberdHttpModule } from '../ejabberd-http/ejabberd-http.module';
import { EjabberdHttpService } from 'src/ejabberd-http/ejabberd-http.service';
import { RoomCreateService } from './room-create.service';
import { RoomDeleteService } from './room-delete.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'bearer' }),
        TypeOrmModule.forFeature([Room]),
        HttpModule,
        EjabberdHttpModule
    ],
    providers: [
        RoomService,
        RoomCreateService,
        RoomDeleteService,
        EjabberdHttpService
    ],
    controllers: [RoomController]
})
export class RoomModule {}