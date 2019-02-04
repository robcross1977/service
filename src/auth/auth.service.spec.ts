import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

const userServiceProvider = {
  provide: UserService,
  useValue: {
    findOneByToken(token: string) {
        return true;
    }
  }
}

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, userServiceProvider]
        }).compile();

        userService = module.get<UserService>(UserService);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        // arrange
        // act
        // assert
        expect(authService).toBeDefined();
    });

    describe('validateUser method', () => {
        it('should be defined', async () => {
            // arrange
            // act
            // assert
            expect(authService.validateUser).toBeDefined();
        });

        it('should return the result of a call to userService.findOneByToken', async () => {
            // arrange
            const token = 'no matter';
            jest.spyOn(userService, 'findOneByToken').mockResolvedValue(true);

            // act
            const result = await authService.validateUser(token);

            // assert
            expect(result).toBeTruthy();
            expect(userService.findOneByToken).toBeCalledTimes(1);
            expect(userService.findOneByToken).toHaveBeenCalledWith(token);
        });
    });
});
