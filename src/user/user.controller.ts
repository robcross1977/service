import { Controller, Post, Body, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterface } from './user.interface';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() user: UserInterface) {
        return this.userService.create(user);
    }
}