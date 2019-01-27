import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('room')
export class RoomController {
    
    @Get()
    @UseGuards(AuthGuard('bearer'))
    async create() {
        console.log("saying hullo");
    }
}
