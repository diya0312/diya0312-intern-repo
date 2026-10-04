import { Body, Controller, Post } from '@nestjs/common';
import { BackgroundJobService } from './background-job.service';

@Controller('background-jobs')
export class BackgroundJobController {
  constructor(
    private readonly backgroundJobService: BackgroundJobService,
  ) {}

  @Post()
  addJob(@Body('message') message: string) {
    return this.backgroundJobService.addJob(message);
  }

  @Post('fail')
  addFailingJob() {
    return this.backgroundJobService.addFailingJob();
  }
}