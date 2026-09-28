import { Test, TestingModule } from '@nestjs/testing';
import { CliDemoController } from './cli-demo.controller';

describe('CliDemoController', () => {
  let controller: CliDemoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CliDemoController],
    }).compile();

    controller = module.get<CliDemoController>(CliDemoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
