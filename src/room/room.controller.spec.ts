import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { Repository } from 'typeorm';

const testUser = {
    id: 'testUser',
    email: 'testUser@test.com'
}

const roomServiceProvider = {
    provide: RoomService,
    useValue: {
        create(req: any) {
            return testUser;
        },
        readAll(req: any) {
            return [testUser];
        },
        delete(req: any) {
            return {message: 'testUser deleted', user: testUser}
        }
    }
}

export class RoomRepository extends Repository<Room> {}

describe('Room Controller', () => {
    let module: TestingModule;
    let roomController: RoomController;
    let roomService: RoomService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                roomServiceProvider, 
                {
                    provide: RoomRepository,
                    useClass: RoomRepository
                }
            ],
            controllers: [RoomController]
        }).compile();

        roomController = module.get<RoomController>(RoomController);
        roomService = module.get<RoomService>(RoomService);
    });
    
    it('should be defined', () => {
        expect(roomController).toBeDefined();
    });

    describe('create method', () => {
        it('should exist', () => {
            // arrange
            // act
            // assert
            expect(roomController.create).toBeDefined();
        });

        it('should call roomService.create', async () => {
            // arrange
            jest.spyOn(roomService, 'create');

            // act
            const result = await roomController.create({user: testUser});

            // assert
            expect(roomService.create).toBeCalledTimes(1);
            expect(roomService.create).toBeCalledWith(testUser);
            expect(result).toEqual(testUser);
        });
    });

    describe('readAll method', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(roomController.readAll).toBeDefined();
        });

        it('should call roomService.readAll', async () => {
            // arrange
            jest.spyOn(roomService, 'readAll');

            // act
            const result = await roomController.readAll({user: testUser});

            // assert
            expect(roomService.readAll).toBeCalledTimes(1);
            expect(roomService.readAll).toBeCalledWith(testUser.email);
            expect(result).toEqual([testUser]);
        });
    });
});