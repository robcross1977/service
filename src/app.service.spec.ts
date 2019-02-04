import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let service: AppService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService]
        }).compile();
        
        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('the getHello method', () => {
        it('should exist', () => {
            expect(service.getHello).toBeDefined();
        });

        it('should return a string to use from the title (we don\'t care what it says so much', () => {
            expect(typeof service.getHello()).toEqual('string');
        });
    });
});