import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { CryptoModule } from '../crypto/crypto.module';
import { User } from './user.entity';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      CryptoModule
    ],
    controllers: [UserController],
    providers: [UserService, CryptoService]
})
export class UserModule {}
