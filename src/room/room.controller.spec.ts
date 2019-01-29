import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { PassportModule } from '@nestjs/passport';
import { RoomService } from './room.service';

describe('Room Controller', () => {
    let module: TestingModule;
    
    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'bearer' })
            ],
            providers: [
                RoomService
            ],
            controllers: [RoomController]
        }).compile();
    });
    
    it('should be defined', () => {
        const controller: RoomController = module.get<RoomController>(RoomController);
        expect(controller).toBeDefined();
    });
});
