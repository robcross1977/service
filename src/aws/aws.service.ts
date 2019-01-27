import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import * as aws from 'aws-sdk';
import { CognitoUser } from "./cognitoUser.dto";

@Injectable()
export class AwsService {
    constructor(private readonly configService: ConfigService) {
        const credentials = new aws.Credentials(
            configService.get("COGNITO_CLIENT_ID"),
            configService.get("COGNITO_CLIENT_SECRET")
        );
        aws.config.credentials = credentials;
        aws.config.region = configService.get("AWS_REGION")
    }

    async getCognitoUser(token: string): Promise<CognitoUser> {
        const cognito = new aws.CognitoIdentityServiceProvider({});

        try {
            const data = await cognito.getUser({AccessToken: token}).promise();

            const user = new CognitoUser();
            user.id = data.Username;

            data.UserAttributes.forEach((attr) => {
                if (attr.Name == 'email') {
                    user.email = attr.Value;
                }
            });

            return user;
        } catch(error) {
            console.log(error);
            console.log("CATCH EXPIRED TOKEN");
        }
        
        return null;
    }
}