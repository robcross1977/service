import { Controller, Post, UseGuards, Request, Param, Delete, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from './room.service';
import { RoomConfig } from './roomConfig';
import { UserInterface } from '../user/user.interface';
import { UserOwnsRoomGuard } from './userOwnsRoom.guard';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    @UseGuards(AuthGuard('bearer'))
    async create(@Request() req: any, @Body() body: RoomConfig): Promise<any> {
        return this.roomService.create(req.user as UserInterface, body);
    }

    @Get()
    @UseGuards(AuthGuard('bearer'))
    async readAll(@Request() req: any) : Promise<any> {
        return this.roomService.readAll(req.user.email);
    }

    @Delete(':room')
    @UseGuards(AuthGuard('bearer'), UserOwnsRoomGuard)
    async delete(@Request() req: any, @Param() params: any): Promise<any> {
        return this.roomService.deleteRoom(req.user, params.room);
    }
}