import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { TypeOrmConfigService } from './type-orm-config.service';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AwsModule } from './aws/aws.module';
import { RoomModule } from './room/room.module';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        AuthModule, 
        PassportModule, AwsModule, RoomModule
    ],
    controllers: [AppController],
    providers: [AppService, TypeOrmConfigService],
    exports: [PassportModule]
})
export class AppModule {}