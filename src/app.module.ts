import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { CryptoModule } from './crypto/crypto.module';
import { TypeOrmConfigService } from './type-orm-config.service';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        CryptoModule,
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
    ],
    controllers: [AppController],
    providers: [AppService, TypeOrmConfigService],
})
export class AppModule {}