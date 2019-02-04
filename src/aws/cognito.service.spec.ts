import { Test, TestingModule } from '@nestjs/testing';
import { CognitoService } from './cognito.service';
import { AwsService } from './aws.service';
import { PromiseResult } from 'aws-sdk/lib/request';
import { CognitoIdentityServiceProvider, AWSError } from 'aws-sdk';

const testToken = 'no matter';

const testUser = {
    Username: 'testUser',
    UserAttributes : [{Name: 'email', Value: 'testUser@test.com'}]
}

const awsServiceProvider = {
    provide: AwsService,
    useValue: {
        CognitoServiceProvider: {
            getUser: () => {
                return { promise: () => testUser }
            }
        }
    }
}

describe('CognitoService', () => {
    let cognitoService: CognitoService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [awsServiceProvider, CognitoService]
        }).compile();

        cognitoService = module.get<CognitoService>(CognitoService);
    });

    it('should be defined', () => {
        // arrange
        // act
        // assert
        expect(cognitoService).toBeDefined();
    });

    describe('getCognitoUser method', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(cognitoService.getCognitoUser).toBeDefined();
        });

        it('should call CognitoServiceProvider.getUser({AccessToken: token})', async () => {
            // arrange
            jest.spyOn(awsServiceProvider.useValue.CognitoServiceProvider, 'getUser');

            // act
            await cognitoService.getCognitoUser(testToken);

            // assert
            expect(awsServiceProvider.useValue.CognitoServiceProvider.getUser).toBeCalledTimes(1);
            expect(awsServiceProvider.useValue.CognitoServiceProvider.getUser).toBeCalledWith({AccessToken: testToken});
        });

        it('should call serializeCognitoUser', async () => {
            // arrange
            jest.spyOn(cognitoService, 'serializeCognitoUser');

            // act
            await cognitoService.getCognitoUser(testToken);

            // assert
            expect(cognitoService.serializeCognitoUser).toBeCalledTimes(1);
            expect(cognitoService.serializeCognitoUser).toBeCalledWith(testUser);
        });

        it('should return a user with attributes serialized from the cognito user', async () => {
            // arrange
            const expectedResult = {
                id: testUser.Username,
                email: testUser.UserAttributes[0].Value
            }

            // act
            const result = await cognitoService.getCognitoUser(testToken);

            // assert
            expect(result).toEqual(expectedResult);
        });
    });

    describe('serializeCognitoUser method', () => {
        it("should be defined", () => {
            // arrange
            // act
            // assert
            expect(cognitoService.serializeCognitoUser).toBeDefined();
        });

        it('should return a user obect made up of the cognitoUser.Username and cognitoUser.UserAttributes.email', () => {
            // arrange
            // act
            // assert
            expect(cognitoService.serializeCognitoUser(<PromiseResult<CognitoIdentityServiceProvider.GetUserResponse, AWSError>>testUser)).toEqual({
                id: testUser.Username,
                email: testUser.UserAttributes[0].Value
            });
        });
    });
});