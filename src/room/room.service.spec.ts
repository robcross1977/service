import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { Repository, IsNull } from 'typeorm';
import { Room } from './room.entity';
import { RoomCreateService } from './room-create.service';
import { RoomDeleteService } from './room-delete.service';
import { EjabberdHttpModule } from '../ejabberd-http/ejabberd-http.module';

export class RoomRepository extends Repository<Room> {}

const testUser = {
    id: 'testUser',
    email: 'testUser@test.com'
};

const testRoom = <Room> {
    roomName: 'testRoom',
    user: testUser
};

describe('RoomService', () => {
    let roomService: RoomService;
    let roomRepository: RoomRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                EjabberdHttpModule
            ],
            providers: [
                RoomService,
                RoomCreateService,
                RoomDeleteService,
                {
                    provide: RoomRepository,
                    useClass: RoomRepository
                }
            ]
        }).compile();

        roomService = module.get<RoomService>(RoomService);
        roomRepository = module.get<RoomRepository>(RoomRepository);
    });

    it('should be defined', () => {
        // arrange
        // act
        // assert
        expect(roomService).toBeDefined();
    });
});