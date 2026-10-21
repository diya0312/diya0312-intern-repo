import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('error-test', () => {
    it('throws a plain Error so the global filter turns it into a 500', () => {
      expect(() => appController.throwUnexpectedError()).toThrow(
        'Simulated unexpected database failure',
      );
    });
  });

  describe('admin', () => {
    it('returns the admin welcome message (the guard is tested separately)', () => {
      expect(appController.getAdminMessage()).toEqual({ message: 'Welcome, admin!' });
    });
  });
});
