import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

describe('AwsService', () => {
    let awsService: AwsService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AwsService],
        }).compile();

        awsService = module.get<AwsService>(AwsService);
    });

    it('should be defined', () => {
        // arrange
        // act
        // assert
        expect(awsService).toBeDefined();
    });

    describe('CognitoServiceProvider property', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(awsService.CognitoServiceProvider).toBeDefined();
        });

        it('should return an instance of a CognitoIdentityServiceProvider', () => {
            // arrange
            // act
            const provider = awsService.CognitoServiceProvider;

            // assert
            expect(provider).toBeInstanceOf(CognitoIdentityServiceProvider);
        });
    });
});