import { Injectable, Logger, Inject } from "@nestjs/common";
import { User } from "../user/user.entity";
import { AwsService } from "./aws.service";
import { PromiseResult } from "aws-sdk/lib/request";
import { CognitoIdentityServiceProvider, AWSError } from "aws-sdk";

@Injectable()
export class CognitoService {
    constructor(private readonly awsService: AwsService) {}

    async getCognitoUser(token: string): Promise<User> {
        try {
            const cognitoUser = await this.awsService.CognitoServiceProvider.getUser({AccessToken: token}).promise();

            return this.serializeCognitoUser(cognitoUser);
        } catch(error) {
            Logger.log({ error: error });
            throw error;
        }
    }

    serializeCognitoUser(cognitoUser: PromiseResult<CognitoIdentityServiceProvider.GetUserResponse, AWSError>): User {
        const user = new User();
        user.id = cognitoUser.Username;

        cognitoUser.UserAttributes.forEach((attr) => {
            if (attr.Name == 'email') {
                user.email = attr.Value;
            }
        });

        return user;
    }
}