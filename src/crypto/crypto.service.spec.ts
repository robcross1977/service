import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
    let service: CryptoService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CryptoService],
        }).compile();

        service = module.get<CryptoService>(CryptoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('hash method', () => {
        it('should exist', () => {
            expect(service.hash).toBeDefined();
        })
    });
});