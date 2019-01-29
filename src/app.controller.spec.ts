import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();
    });

    describe('the getHello method', () => {
        it('should exist', () => {
            const appController = app.get<AppController>(AppController);
            expect(appController.getHello).toBeDefined();
        });

        it('should return a string', () => {
            const appController = app.get<AppController>(AppController);
            expect(typeof appController.getHello()).toBe('string');
        });
    });

    describe('the callback method', () => {
        it('should exist', () => {
            const appController = app.get<AppController>(AppController);
            expect(appController.callback).toBeDefined();
        });
    });
});