import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserInterface } from '../user/user.interface';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async validateUser(token: string): Promise<UserInterface> {
        return await this.userService.findOneByToken(token);
    }
}