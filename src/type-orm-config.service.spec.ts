import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmConfigService } from './type-orm-config.service';

describe('TypeOrmConfigService', () => {
    let service: TypeOrmConfigService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TypeOrmConfigService],
        }).compile();
        
        service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('the createTypeOrmOptions method', () => {
        it('should exist', () => {
            expect(service.createTypeOrmOptions).toBeDefined();
        });
    });
});