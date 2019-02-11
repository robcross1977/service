import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CognitoService } from '../aws/cognito.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const cognitoServiceProvider = {
    provide: CognitoService,
    useValue: {
        getCognitoUser(token: string) {
            return token;
        }
    }
}

export class UserRepository extends Repository<User> {}

const testUser = {
    Username: 'testUser',
    UserAttributes : [{Name: 'email', Value: 'testUser@test.com'}]
}

const testUserInterface = <User> {
    id: testUser.Username,
    email: testUser.UserAttributes[0].Value
};

const testToken = 'no matter';

describe('UserService', () => {
    let userService: UserService;
    let cognitoService: CognitoService;
    let userRepository: UserRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                cognitoServiceProvider,                 
                {
                    provide: UserRepository,
                    useClass: UserRepository
                }
            ]
        }).compile();

        userService = module.get<UserService>(UserService);
        cognitoService = module.get<CognitoService>(CognitoService);
        userRepository = module.get<UserRepository>(UserRepository);
    });
    
    it('should be defined', () => {
        // arrange
        // act
        // assert
        expect(userService).toBeDefined();
    });

    describe('upsertUser method', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(userService.upsertUser).toBeDefined();
        });

        it('should save the user (which upserts)', async () => {
            // arrange
            jest.spyOn(userRepository, 'save').mockResolvedValue(new Promise<User>(resolve => resolve(testUserInterface)));

            // act
            await userService.upsertUser(<User>{
                id: testUser.Username,
                email: testUser.UserAttributes[0].Value
            });

            // assert
            expect(userRepository.save).toHaveBeenCalledTimes(1);
            expect(userRepository.save).toHaveBeenCalledWith(testUserInterface);
        });
    });

    describe('findOneByToken method', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(userService).toBeDefined();
        });

        it('should call cognitoService.getCognitoUser', async () => {
            // arrange
            jest.spyOn(cognitoService, 'getCognitoUser').mockResolvedValue(new Promise<User>(resolve => resolve(testUserInterface)));
            jest.spyOn(userRepository, 'save').mockResolvedValue(new Promise<User>(resolve => resolve(testUserInterface)));

            // act
            await userService.findOneByToken(testToken);

            // assert
            expect(cognitoService.getCognitoUser).toBeCalledTimes(1);
            expect(cognitoService.getCognitoUser).toBeCalledWith(testToken);
        });

        it('if cognitoService.getCognitoUser returns a user it should upsert it', async () => {
            // arrange
            jest.spyOn(cognitoService, 'getCognitoUser').mockResolvedValue(new Promise<User>(resolve => resolve(testUserInterface)));
            jest.spyOn(userRepository, 'save').mockResolvedValue(new Promise<User>(resolve => resolve(testUserInterface)));

            // act
            await userService.findOneByToken(testToken);

            // assert
            expect(userRepository.save).toHaveBeenCalledTimes(1);
            expect(userRepository.save).toBeCalledWith(testUserInterface);
        });

        it('if cognitoService.getCognitoUser returns a user it should return it', async () => {
            // arrange
            jest.spyOn(cognitoService, 'getCognitoUser').mockResolvedValue(new Promise<User>(resolve => resolve(testUserInterface)));
            jest.spyOn(userRepository, 'save').mockResolvedValue(new Promise<User>(resolve => resolve(testUserInterface)));

            // act
            const result = await userService.findOneByToken(testToken);

            // assert
            expect(result).toEqual(testUserInterface);
        });

        it('should throw an UnauthorizedException if cognitoService.getCognitoUser returns nothing', done => {
            // arrange
            jest.spyOn(cognitoService, 'getCognitoUser').mockResolvedValue(undefined);
            
            // act
            userService.findOneByToken(testToken)
                .catch(e => {
                    expect(e).toBeInstanceOf(UnauthorizedException);
                    done();
                });
        });
    });
});