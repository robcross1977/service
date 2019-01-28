import { Logger } from '@nestjs/common';
import XmppClient from '@murderbeard/xmpp';
import { ConfigService } from '../config/config.service';

class XmppService {
    public client: XmppClient;
    public ready: boolean = false;

    constructor() {
        if(!this.client) {
            this.client = new XmppClient();

            this.client.create({
                jid: ConfigService.get('XMPP_ADMIN_USERNAME'),
                password: ConfigService.get('XMPP_ADMIN_PASSWORD'),
                transport: 'websocket',
                wsURL: ConfigService.get('XMPP_SERVER_ROOT')
            });

            this._setupCallbacks();
        }
    }
 
    connect(): void {
        if(!this.ready) {
            this.client.connect();
            Logger.log('Starting xmpp client');
        }
    }

    _setupCallbacks(): void {
        this._setupFailureCallbacks();
        this._setupSessionCallbacks();
    }

    _setupFailureCallbacks(): void {
        this.client.subject('disconnected').subscribe({
            next: (data): void => {
                Logger.log({ data: data, message: 'xmpp client disconnected'});

                process.exit(-1);
            }
        });
    }

    _setupSessionCallbacks(): void {
        this.client.subject('session:started').subscribe({
            next: (data: any): void => {
                Logger.log({ data: data, message: 'xmpp client session:started'});

                this.ready = true;
            }
        });

        this.client.subject('session:end').subscribe({
            next: (data: any): void => {
                Logger.log({ data: data, message: 'xmpp client session:end'});

                this.ready = false;
            }
        });
    }
}
export const xmppService = new XmppService();