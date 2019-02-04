import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import * as aws from 'aws-sdk';
import { CognitoIdentityServiceProvider } from "aws-sdk";

@Injectable()
export class AwsService {
    private _cognitoServiceProvider: CognitoIdentityServiceProvider;

    constructor() {
        aws.config.credentials = new aws.Credentials(
            ConfigService.get("COGNITO_CLIENT_ID"),
            ConfigService.get("COGNITO_CLIENT_SECRET")
        );

        aws.config.region = ConfigService.get("AWS_REGION");

        this._cognitoServiceProvider = new aws.CognitoIdentityServiceProvider({});
    }

    get CognitoServiceProvider(): CognitoIdentityServiceProvider  {
        return this._cognitoServiceProvider;
    }
}