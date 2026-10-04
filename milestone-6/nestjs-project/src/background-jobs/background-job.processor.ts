import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('background-jobs')
export class BackgroundJobProcessor extends WorkerHost {
  async process(job: Job): Promise<string> {
    console.log(
      `Processing job ${job.id}: ${job.name}`,
      job.data,
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (job.name === 'failing-job') {
      throw new Error('Simulated background job failure');
    }

    console.log(`Completed job ${job.id}`);

    return `Processed ${job.name}`;
  }
}