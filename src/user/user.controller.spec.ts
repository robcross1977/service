import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { CryptoModule } from '../crypto/crypto.module';
import { CryptoService } from '../crypto/crypto.service';

describe('User Controller', () => {
    let module: TestingModule;
    
    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([User]),
                CryptoModule
            ],
            controllers: [UserController],
            providers: [
                UserService,
                CryptoService
            ]
        }).compile();
    });

    it('should be defined', () => {
        const controller: UserController = module.get<UserController>(UserController);
        expect(controller).toBeDefined();
    });
});