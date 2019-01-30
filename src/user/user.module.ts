import { Module, Global } from "@nestjs/common";
import { UserService } from "./user.service";
import { AwsService } from "../aws/aws.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user.entity";

@Global()
@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      AwsService
    ],
    providers: [
        AwsService,
        {
          provide: UserService,
          useValue: new UserService(new AwsService()),
        },
    ],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}