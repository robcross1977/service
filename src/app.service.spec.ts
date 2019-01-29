import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './type-orm-config.service';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AwsModule } from './aws/aws.module';
import { RoomModule } from './room/room.module';
import { AppController } from './app.controller';

describe('AppService', () => {
    let service: AppService;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UserModule,
                TypeOrmModule.forRootAsync({
                    useClass: TypeOrmConfigService,
                }),
                AuthModule, 
                PassportModule,
                AwsModule,
                RoomModule
            ],
            controllers: [AppController],
            providers: [AppService, TypeOrmConfigService],
            exports: [PassportModule]
        }).compile();
        
        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('the getHello method', () => {
        it('should exist', () => {
            expect(service.getHello).toBeDefined();
        });

        it('should return a string to use from the title (we don\'t care what it says so much', () => {
            expect(typeof service.getHello()).toEqual('string');
        });
    });
});