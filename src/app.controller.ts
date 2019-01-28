import { Controller, Get, Body, Param, Query, Request, Response, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
       return this.appService.getHello();
    }

    @Get('callback')
    callback(): any {
    }
}