import { jest } from '@jest/globals';
import type { Job } from 'bullmq';
import { BackgroundJobProcessor } from './background-job.processor';

describe('BackgroundJobProcessor', () => {
  let processor: BackgroundJobProcessor;
  let logSpy: ReturnType<typeof jest.spyOn>;

  const makeJob = (name: string, attemptsMade = 0) =>
    ({ id: '1', name, data: { message: 'hi' }, attemptsMade, opts: { attempts: 3 } }) as unknown as Job;

  beforeEach(() => {
    jest.useFakeTimers();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    processor = new BackgroundJobProcessor();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('completes a normal job after the simulated 2 second delay', async () => {
    const result = processor.process(makeJob('send-notification'));
    await jest.advanceTimersByTimeAsync(2000);

    await expect(result).resolves.toBe('Processed send-notification');
    expect(logSpy).toHaveBeenCalledWith('Completed job 1');
  });

  it('throws for the failing-job so BullMQ can retry it', async () => {
    const result = processor.process(makeJob('failing-job'));
    const assertion = expect(result).rejects.toThrow('Simulated background job failure');
    await jest.advanceTimersByTimeAsync(2000);

    await assertion;
  });

  it('logs "will retry" when attempts are left', () => {
    processor.onFailed(makeJob('failing-job', 1), new Error('boom'));

    expect(logSpy).toHaveBeenCalledWith('Job 1 failed on attempt 1/3: boom -> will retry');
  });

  it('logs the final failure when no attempts are left', () => {
    processor.onFailed(makeJob('failing-job', 3), new Error('boom'));

    expect(logSpy).toHaveBeenCalledWith(
      'Job 1 failed on attempt 3/3: boom -> no retries left, job moved to failed state',
    );
  });
});
