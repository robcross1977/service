import { Test, TestingModule } from '@nestjs/testing';
import { EjabberdHttpService } from './ejabberd-http.service';
import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

describe('EjabberdHttpService', () => {
    let service: EjabberdHttpService;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [EjabberdHttpService]
        }).compile();

        service = module.get<EjabberdHttpService>(EjabberdHttpService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('call method', () => {
        it('should be defined', () => {
            expect(service.call).toBeDefined();
        });

        it('should call http post with the url and data passed in', () => {
            const endpoint = 'testEndpoint';
            const url = `${ConfigService.get('XMPP_SERVER_ROOT')}/${endpoint}`;
            const data = { test: 'test' };
            const header = {
                headers: {'Authorization': `Bearer ${ConfigService.get('XMPP_ADMIN_TOKEN')}`}
            };
            const postReturn = {
                message: true,
                pipe: () => jest.fn()
            };

            jest.spyOn(httpService, 'post').mockReturnValue(postReturn);

            service.call(endpoint, data);
            
            expect(httpService.post).toBeCalledWith(url, data, header);
        });
    });
});
