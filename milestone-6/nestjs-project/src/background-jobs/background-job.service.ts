import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BackgroundJobService {
  constructor(
    @InjectQueue('background-jobs')
    private readonly backgroundJobQueue: Queue,
  ) {}

  addJob(message: string) {
    return this.backgroundJobQueue.add(
      'send-notification',
      { message },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
      },
    );
  }

  addFailingJob() {
    return this.backgroundJobQueue.add(
      'failing-job',
      {
        message: 'This job is expected to fail',
      },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
      },
    );
  }
}