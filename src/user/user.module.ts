import { Module, Global } from "@nestjs/common";
import { UserService } from "./user.service";
import { AwsService } from "../aws/aws.service";
import { UserController } from "./user.controller";

@Global()
@Module({
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
})
export class UserModule {}