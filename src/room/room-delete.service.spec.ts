import { Test, TestingModule } from '@nestjs/testing';
import { RoomDeleteService } from './room-delete.service';
import { EjabberdHttpService } from '../ejabberd-http/ejabberd-http.service';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { EjabberdHttpModule } from '../ejabberd-http/ejabberd-http.module';

export class RoomRepository extends Repository<Room> {}

describe('RoomDeleteService', () => {
    let service: RoomDeleteService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EjabberdHttpModule],
            providers: [
                RoomDeleteService,
                EjabberdHttpService,
                {
                    provide: RoomRepository,
                    useClass: RoomRepository
                }]
        }).compile();

        service = module.get<RoomDeleteService>(RoomDeleteService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});