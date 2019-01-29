import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AwsService } from '../aws/aws.service';
import { UserService } from './user.service';

describe('User Controller', () => {
    let module: TestingModule;
    
    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                AwsService,
                {
                  provide: UserService,
                  useValue: new UserService(new AwsService()),
                },
              ],
            imports: [AwsService],
            exports: [UserService],
            controllers: [UserController]
        }).compile();
    });

    it('should be defined', () => {
        const controller: UserController = module.get<UserController>(UserController);
        expect(controller).toBeDefined();
    });
});