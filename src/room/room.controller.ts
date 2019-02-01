import { Controller, Post, UseGuards, Request, Param, Delete, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    @UseGuards(AuthGuard('bearer'))
    async create(@Request() req: any): Promise<any> {
        return await this.roomService.create(req.user);
    }

    @Get()
    @UseGuards(AuthGuard('bearer'))
    async readAll(@Request() req: any) : Promise<any> {
        return await this.roomService.readAll(req.user.email);
    }

    @Delete(':rooms')
    @UseGuards(AuthGuard('bearer'))
    async delete(@Request() req: any, @Param() params: any): Promise<any> {
        return await this.roomService.delete(params.rooms, req.user.email);
    }
}