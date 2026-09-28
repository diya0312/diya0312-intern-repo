import { Test, TestingModule } from '@nestjs/testing';
import { CliDemoService } from './cli-demo.service';

describe('CliDemoService', () => {
  let service: CliDemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CliDemoService],
    }).compile();

    service = module.get<CliDemoService>(CliDemoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
