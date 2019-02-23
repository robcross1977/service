import { Test, TestingModule } from '@nestjs/testing';
import { RoomCreateService } from './room-create.service';
import { EjabberdHttpService } from '../ejabberd-http/ejabberd-http.service';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { EjabberdHttpModule } from '../ejabberd-http/ejabberd-http.module';

export class RoomRepository extends Repository<Room> {}

describe('RoomCreateService', () => {
    let service: RoomCreateService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EjabberdHttpModule],
            providers: [
                RoomCreateService,
                EjabberdHttpService,
                {
                    provide: RoomRepository,
                    useClass: RoomRepository
                }
            ]
        }).compile();

        service = module.get<RoomCreateService>(RoomCreateService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});