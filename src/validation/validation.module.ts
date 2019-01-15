import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { PasswordService } from './password.service';

@Module({
    providers: [EmailService, PasswordService]
})
export class ValidationModule {}
