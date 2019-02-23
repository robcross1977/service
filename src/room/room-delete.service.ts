import { Injectable, Logger } from '@nestjs/common';
import { RoomConfig } from './roomConfig';
import { UserInterface } from '../user/user.interface';
import { ConfigService } from '../config/config.service';
import { EjabberdHttpService } from '../ejabberd-http/ejabberd-http.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { RoomErrors } from './roomErrors.enum';

@Injectable()
export class RoomDeleteService {
    private roomConfig: RoomConfig; 
    private user: UserInterface;

    constructor(
        private readonly ejabberdHttpService: EjabberdHttpService, 
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) {}

    delete(user: UserInterface, roomName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setConfig(user, { name: roomName, service: ConfigService.get('XMPP_SERVICE') });
            Logger.log(`delete room called by ${JSON.stringify(user)} - start`);

            this.ejabberdHttpService.call('destroy_room', this.roomConfig)
                .subscribe(
                    async val => {
                        if(val) {
                            resolve(await this.deletePersisted());
                        } else {
                            reject(RoomErrors.ROOM_DELETE_FAILED);
                        }
                    },
                    error => reject(this.error(error)),
                    this.complete.bind(this)
                );
        });
    }

    async deletePersisted() {
        const room = await this.roomRepository.findOne({roomName: this.roomConfig.name});
        room.deletedAt = moment().toDate();
        const result = await this.roomRepository.save(room);
        Logger.log(`Room: ${this.roomConfig.name} belonging to ${JSON.stringify(this.user)} has been destroyed`);
        return result;
    }

    setConfig(user: UserInterface, roomConfig: RoomConfig) {
        this.roomConfig = roomConfig;
        this.user = user;
    }

    error(error: any) {
        const errorMessage = {message: `delete roomn called by ${JSON.stringify(this.user)} - error`, error: error}
        Logger.error(errorMessage);
        return errorMessage;
    }

    complete() {
        Logger.log(`delete room called by ${JSON.stringify(this.user)} - complete`);
    }
}