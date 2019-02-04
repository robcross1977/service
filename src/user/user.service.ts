import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { CognitoService } from '../aws/cognito.service';
import { UserInterface } from './user.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        private readonly cognitoService: CognitoService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async upsertUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async findOneByToken(token: string): Promise<UserInterface> {
        const user = await this.cognitoService.getCognitoUser(token);

        if(user) {
            await this.upsertUser(user);

            return user;
        } else {
            throw new UnauthorizedException('User wasn\'t found or token is expired');
        }   
    }
}