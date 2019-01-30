import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import * as aws from 'aws-sdk';
import { User } from "../user/user.entity";

@Injectable()
export class AwsService {
    constructor() {
        const credentials = new aws.Credentials(
            ConfigService.get("COGNITO_CLIENT_ID"),
            ConfigService.get("COGNITO_CLIENT_SECRET")
        );
        aws.config.credentials = credentials;
        aws.config.region = ConfigService.get("AWS_REGION")
    }

    async getCognitoUser(token: string): Promise<User> {
        const cognito = new aws.CognitoIdentityServiceProvider({});

        try {
            const data = await cognito.getUser({AccessToken: token}).promise();
            
            const user = new User();
            user.id = data.Username;
            data.UserAttributes.forEach((attr) => {
                if (attr.Name == 'email') {
                    user.email = attr.Value;
                }
            });

            return user;
        } catch(error) {
            Logger.log({ error: error });
        }
        
        return null;
    }
}