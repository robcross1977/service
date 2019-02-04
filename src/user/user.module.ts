import { Module, Global } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { AwsModule } from "../aws/aws.module";
import { CognitoService } from "../aws/cognito.service";
import { AwsService } from "../aws/aws.service";

@Global()
@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      AwsModule
    ],
    providers: [
        CognitoService,
        AwsService,
        UserService
    ],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}