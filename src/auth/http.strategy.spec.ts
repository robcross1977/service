import { Test, TestingModule } from '@nestjs/testing';
import { HttpStrategy } from './http.strategy';
import { AuthService } from './auth.service';
import { UserInterface } from '../user/user.interface';
import { UnauthorizedException } from '@nestjs/common';

const testToken = 'no matter';

const testUser = <UserInterface> {
    id: 'testUser',
    email: 'testUser'
}

const authServiceProvider = {
    provide: AuthService,
    useValue: {
        validateUser(token: string) {
            return testUser;
        }
    }
}

describe('HttpStrategy', () => {
    let authService: AuthService;
    let httpStrategy: HttpStrategy;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HttpStrategy, authServiceProvider]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        httpStrategy = module.get<HttpStrategy>(HttpStrategy);
    });

    it('should be defined', () => {
        // arrange
        // act
        // assert
        expect(httpStrategy).toBeDefined();
    });

    describe('validate method', () => { 
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(httpStrategy.validate).toBeDefined();
        });

        it('should call authService.validateUser one time, passing in the token', async () => {
            // arrange
            jest.spyOn(authService, 'validateUser').mockResolvedValue(new Promise<UserInterface>(resolve => resolve(testUser)));

            // act
            await httpStrategy.validate(testToken);

            // assert
            expect(authService.validateUser).toHaveBeenCalledTimes(1);
            expect(authService.validateUser).toHaveBeenCalledWith(testToken);
        });

        it('should return the user if authService.validateUser returns a user', async () => {
            // arrange
            jest.spyOn(authService, 'validateUser').mockResolvedValue(new Promise<UserInterface>(resolve => resolve(testUser)));

            // act
            const result = await httpStrategy.validate(testToken);

            // assert
            expect(result).toEqual(testUser);
        });

        it('should throw an UnauthorizedException if authService.validate user does not return a user', async () => {
            // arrange
            jest.spyOn(authService, 'validateUser').mockResolvedValue(undefined);

            // act
            try {
                await httpStrategy.validate(testToken);
            } catch(e) {
                // assert
                expect(e).toBeInstanceOf(UnauthorizedException);
            }
        });
    });
});