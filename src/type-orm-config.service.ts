import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: ConfigService.get('TYPEORM_HOST'),
            port: Number(ConfigService.get('TYPEORM_PORT')),
            username: ConfigService.get('TYPEORM_USERNAME'),
            password: ConfigService.get('TYPEORM_PASSWORD'),
            database: ConfigService.get('TYPEORM_DATABASE'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false
        };
    }
}