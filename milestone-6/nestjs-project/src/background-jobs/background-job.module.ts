import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BackgroundJobController } from './background-job.controller';
import { BackgroundJobProcessor } from './background-job.processor';
import { BackgroundJobService } from './background-job.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'background-jobs',
    }),
  ],
  controllers: [BackgroundJobController],
  providers: [BackgroundJobService, BackgroundJobProcessor],
})
export class BackgroundJobModule {}