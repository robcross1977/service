import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as validator from 'email-validator';

@Injectable()
export class EmailService {
    validate(email: string): void {
        if(!validator.validate(email)) {
            throw new HttpException('User email is invalid', HttpStatus.BAD_REQUEST)
        }
    }
}
