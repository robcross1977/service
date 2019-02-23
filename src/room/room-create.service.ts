import { Injectable } from '@nestjs/common';
import { Logger } from "@nestjs/common";
import { EjabberdHttpService } from '../ejabberd-http/ejabberd-http.service';
import { RoomConfig } from "./roomConfig";
import { UserInterface } from '../user/user.interface';
import { Room } from "./room.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observer } from 'rxjs';
import { ConfigService } from '../config/config.service';
import * as shortid from 'shortid';

@Injectable()
export class RoomCreateService {
    private roomConfig: RoomConfig; 
    private user: UserInterface;

    constructor(
        private readonly ejabberdHttpService: EjabberdHttpService,
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>) {}

    create(user: UserInterface, roomConfig: RoomConfig): Promise<any> {
        this.setConfig(user, roomConfig);
        this.injectEnvironmentValuesToRoomConfig();
        Logger.log(`create user called by ${JSON.stringify(user)} - start`);

        return new Promise((resolve: Function, reject: Function): void => {
            this.ejabberdHttpService.call('create_room_with_opts', roomConfig)
                .subscribe(<Observer<any>> {
                    next: async val => resolve(await this.persist(val)),
                    error: error => reject(this.error(error)),
                    complete: this.complete.bind(this)
                });
        });
    }

    setConfig(user: UserInterface, roomConfig: RoomConfig) {
        this.roomConfig = roomConfig;
        this.user = user;
    }

    async persist(val: any) {
        if(val) {
            return await this.saveRoom(this.roomConfig.name, this.roomConfig.service, this.roomConfig.host, this.user)
        } else {
            const message = `room creation failed. Room created by ${JSON.stringify(this.user)} already exists or an error occurred when persisting room: ${JSON.stringify(this.roomConfig)}`;
            Logger.error(message);
            return { error: 'room_creation_failed', message: message };
        }
    }

    error(error: any) {
        const errorMessage = {message: `create roomn called by ${JSON.stringify(this.user)} - error`, error: error}
        Logger.error(errorMessage);
        return errorMessage;
    }

    complete() {
        Logger.log(`create room called by ${JSON.stringify(this.user)} - complete`);
    }

    async saveRoom(roomName: string, service: string, host: string, user: UserInterface): Promise<Room> {
        const result = await this.roomRepository.save(<Room> { 
            roomName: roomName,
            service: service,
            host: host,
            user: user
        });

        Logger.log(`room persisted: ${JSON.stringify(result)}`);

        return result;
    }

    private injectEnvironmentValuesToRoomConfig() {
        // we are going to overwrite these variables even if they are set
        this.roomConfig.name = this.roomConfig.name ? this.roomConfig.name : shortid.generate();
        this.roomConfig.service = ConfigService.get('XMPP_SERVICE'); 
        this.roomConfig.host = ConfigService.get('XMPP_HOST');

        return this.roomConfig;
    }
}