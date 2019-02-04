import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { Repository, IsNull } from 'typeorm';
import { Room } from './room.entity';

export class RoomRepository extends Repository<Room> {}

const testUser = {
    id: 'testUser',
    email: 'testUser@test.com'
};

const testRoom = {
    roomName: 'testRoom',
    user: testUser
};

describe('RoomService', () => {
    let roomService: RoomService;
    let roomRepository: RoomRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomService,
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

    describe('create method', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(roomService.create).toBeDefined();
        });
    });

    describe('read all', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(roomService.readAll).toBeDefined();
        });

        it('should call roomRepository.find', async () => {
            // arrange
            jest.spyOn(roomRepository, "find").mockResolvedValue(testRoom);

            // act
            await roomService.readAll(testUser.email);
            
            // assert
            expect(roomRepository.find).toBeCalledTimes(1);
            expect(roomRepository.find).toHaveBeenCalledWith({
                where: {
                    userEmail: testUser.email,
                    deletedAt: IsNull()
                }
            });
        });
    });

    describe('delete method', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(roomService.deleteRoom).toBeDefined();
        });

        it('should return a promise', () => {
            // arrange
            jest.spyOn(roomService, 'deleteRoom').mockImplementation(room => {
                return new Promise(resolve => {
                    resolve(room);
                });
            });

            // act
            const result = roomService.delete('1,2,3', testUser.email);

            // assert
            expect(result).toBeInstanceOf(Promise);
        });

        it('should call deleteRoom as many times as there are comma seperated items in rooms, and then should return it as an array', async () => {
            // arrange
            const rooms = '1,2,3';

            jest.spyOn(roomService, 'deleteRoom').mockImplementation(room => {
                return new Promise(resolve => {
                    resolve(room);
                });
            });

            // act
            const result = await roomService.delete(rooms, testUser.email);

            // assert
            expect(roomService.deleteRoom).toBeCalledTimes(rooms.split(',').length);
            expect(result).toEqual(rooms.split(','));
        });
    });

    describe('deleteRoom method', () => {
        it('should be defined', () => {
            // arrange
            // act
            // assert
            expect(roomService.deleteRoom).toBeDefined();
        });

        it('should throw if the roomname is falsey', done => {
            // arrange
            jest.spyOn(roomService, 'userOwnsRoom').mockResolvedValue(true);

            // act
            roomService.deleteRoom('', testUser.email)
                .catch(e => {
                    expect(e).toEqual({
                        name: 'RoomCreateError',
                        message: `failed to destroy room: , please check the name of the room and try again`
                    });

                    done();
                });
        });

        // I can't get this test to work for some reason even though it works when I run the service
        it('should throw if the user does not own the room', done => {
            // arrange
            jest.spyOn(roomService, 'userOwnsRoom').mockResolvedValue(false);

            // act
            roomService.deleteRoom(testRoom.roomName, testUser.email)
                .catch(e => {
                    expect(e).toEqual({
                        name: 'RoomCreateError',
                        message: `failed to destroy room: ${testRoom.roomName}, please check the name of the room and try again`
                    });

                    done();
                });
        });
    });

    describe('userOwnsRoom method', () => {
        it('should be defined', async () => {
            // arrange
            // act
            // assert
            expect(roomService.userOwnsRoom).toBeDefined();
        });

        it('should return true if a user is found', async () => {
            // arrange
            jest.spyOn(roomRepository, 'find').mockResolvedValue(testRoom);
            
            // act
            // assert
            expect(await roomService.userOwnsRoom(testRoom.roomName, testUser.email)).toBeTruthy();
        });

        it('should return false if a user is not found', async () => {
            // arrange
            jest.spyOn(roomRepository, 'find').mockResolvedValue(null);
            
            // act
            // assert
            expect(await roomService.userOwnsRoom(testRoom.roomName, testUser.email)).toBeFalsy();
        });
    });
});