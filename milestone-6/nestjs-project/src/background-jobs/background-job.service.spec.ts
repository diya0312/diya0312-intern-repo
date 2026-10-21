import { jest } from '@jest/globals';
import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundJobService } from './background-job.service';

describe('BackgroundJobService (mocked BullMQ queue)', () => {
  let service: BackgroundJobService;
  const mockQueue = { add: jest.fn<(...args: unknown[]) => Promise<{ id: string }>>() };
  const retryOptions = { attempts: 3, backoff: { type: 'fixed', delay: 1000 } };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockQueue.add.mockResolvedValue({ id: '42' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackgroundJobService,
        { provide: getQueueToken('background-jobs'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<BackgroundJobService>(BackgroundJobService);
  });

  it('addJob() queues a send-notification job with 3 attempts and a fixed backoff', async () => {
    await expect(service.addJob('Hello')).resolves.toEqual({ id: '42' });

    expect(mockQueue.add).toHaveBeenCalledWith(
      'send-notification',
      { message: 'Hello' },
      retryOptions,
    );
  });

  it('addFailingJob() queues the failing-job with the same retry settings', async () => {
    await service.addFailingJob();

    expect(mockQueue.add).toHaveBeenCalledWith(
      'failing-job',
      { message: 'This job is expected to fail' },
      retryOptions,
    );
  });
});
