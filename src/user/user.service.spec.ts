import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AwsService } from '../aws/aws.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
    let service: UserService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AwsService,
                {
                  provide: UserService,
                  useValue: new UserService(new AwsService())
                },
              ],
            imports: [
                AwsService,
                TypeOrmModule.forFeature([User])
            ],
            exports: [UserService]
        }).compile();

        service = module.get<UserService>(UserService);
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});