import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { AwsService } from '../aws/aws.service';
import { UserInterface } from './user.interface';
import { getRepository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        private readonly awsService: AwsService
    ) {}

    async upsertUser(user: User): Promise<User> {
        return await getRepository(User).save(user);
    }

    async findOneByToken(token: string): Promise<UserInterface> {
        const user = await this.awsService.getCognitoUser(token);

        if(user) {
            await this.upsertUser(user);

            return user;
        } else {
            throw new UnauthorizedException('User wasn\'t found or token is expired');
        }
        
    }
}