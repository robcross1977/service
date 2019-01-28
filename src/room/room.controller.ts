import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    @UseGuards(AuthGuard('bearer'))
    async create(@Request() req: any) {
        this.roomService.create(req.user.email);
    }
}