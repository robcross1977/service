import { Injectable, Logger, Request } from '@nestjs/common';
import { xmppService } from '../xmpp/xmpp.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RoomService {
    constructor() {}

    async create(email: string) {
        Logger.log('creating a new muc room');
        let roomName = '';
        // TO DO: This should make a room for the USER, need to get it off the token, not for the admin, this is just for test
        xmppService.client.muc.createAnonRoom(ConfigService.get('XMPP_ADMIN_NICK')).subscribe({
            // The last value it will return here is the roomName.
            // if you just reset the variable everytime it should
            // be left with the very last one, which should be correct.
            // know it is gross, but can't think of a better way.
            next: (data: string) => roomName = data,
            error: (error: any) => Logger.error({ error: error, message: 'Error occured while creating room'}),
            complete: async () => {
                // TO DO: ADD USER ROOM TO DB
                Logger.log(`Room created - ${roomName}`);
            }
        });
    }
}