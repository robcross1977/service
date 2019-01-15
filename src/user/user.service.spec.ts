import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CryptoModule} from '../crypto/crypto.module';
import { CryptoService } from '../crypto/crypto.service';


describe('UserService', () => {
    let service: UserService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CryptoModule],
            providers: [UserService, CryptoService]
        }).compile();

        service = module.get<UserService>(UserService);
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});