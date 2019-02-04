import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';

describe('User Controller', () => {
    let module: TestingModule;
    let userController: UserController;
    
    beforeAll(async () => {
        module = await Test.createTestingModule({
            controllers: [UserController]
        }).compile();

        userController = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        
        expect(userController).toBeDefined();
    });
});