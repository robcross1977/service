import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { AwsService } from '../aws/aws.service';
import {UserInterface } from './user.interface';

@Injectable()
export class UserService {
    private user: User;

    constructor(private readonly awsService: AwsService) {
        this.user = new User();
    }

    async findOneByToken(token: string): Promise<UserInterface> {
        return await this.awsService.getCognitoUser(token);
    }
}