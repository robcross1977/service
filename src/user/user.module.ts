import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { CryptoModule } from '../crypto/crypto.module';
import { User } from './user.entity';
import { CryptoService } from 'src/crypto/crypto.service';
import { ValidationModule } from 'src/validation/validation.module';
import { EmailService } from 'src/validation/email.service';
import { PasswordService } from 'src/validation/password.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CryptoModule,
        ValidationModule
    ],
    controllers: [UserController],
    providers: [UserService, CryptoService, EmailService, PasswordService]
})
export class UserModule {}