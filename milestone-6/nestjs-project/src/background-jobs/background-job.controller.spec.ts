import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundJobController } from './background-job.controller';
import { BackgroundJobService } from './background-job.service';

describe('BackgroundJobController (mocked service)', () => {
  let controller: BackgroundJobController;
  const mockService = {
    addJob: jest.fn<(message: string) => Promise<{ id: string }>>(),
    addFailingJob: jest.fn<() => Promise<{ id: string }>>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackgroundJobController],
      providers: [{ provide: BackgroundJobService, useValue: mockService }],
    }).compile();

    controller = module.get<BackgroundJobController>(BackgroundJobController);
  });

  it('addJob() queues the message from the request body', async () => {
    mockService.addJob.mockResolvedValue({ id: '1' });

    await expect(controller.addJob('Send reminder')).resolves.toEqual({ id: '1' });
    expect(mockService.addJob).toHaveBeenCalledWith('Send reminder');
  });

  it('addFailingJob() queues the failing test job', async () => {
    mockService.addFailingJob.mockResolvedValue({ id: '2' });

    await expect(controller.addFailingJob()).resolves.toEqual({ id: '2' });
    expect(mockService.addFailingJob).toHaveBeenCalledTimes(1);
  });
});
