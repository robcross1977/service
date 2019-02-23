import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class EjabberdHttpService {
    constructor(private readonly httpService: HttpService) {}
    
    private defaultHttpConfig = {
        headers: {'Authorization': `Bearer ${ConfigService.get('XMPP_ADMIN_TOKEN')}`}
    };

    public call(endpoint: string, data?: any) {
        return this.httpService.post(`${ConfigService.get('XMPP_SERVER_ROOT')}/${endpoint}`, data, this.defaultHttpConfig)
            .pipe(map(res => res && res.data === 0));
    }
}