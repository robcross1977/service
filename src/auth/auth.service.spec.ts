import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { HttpStrategy } from "./http.strategy";

describe('AuthService', () => {
    let service: AuthService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
            providers: [AuthService, HttpStrategy]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
