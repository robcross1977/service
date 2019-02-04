import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { CognitoService } from './cognito.service';

@Module({
    providers: [AwsService, CognitoService],
    exports: [CognitoService]
})
export class AwsModule {}