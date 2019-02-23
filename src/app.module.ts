import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmConfigService } from './type-orm-config.service';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AwsModule } from './aws/aws.module';
import { RoomModule } from './room/room.module';
import { EjabberdHttpModule } from './ejabberd-http/ejabberd-http.module';
import { RoomDeleteService } from './room/room-delete.service';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        AuthModule, 
        PassportModule,
        AwsModule,
        RoomModule,
        EjabberdHttpModule
    ],
    controllers: [AppController],
    providers: [AppService, TypeOrmConfigService, RoomDeleteService],
    exports: [PassportModule]
})
export class AppModule {}