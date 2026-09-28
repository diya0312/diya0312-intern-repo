import { Module } from '@nestjs/common';
import { CliDemoController } from './cli-demo.controller';
import { CliDemoService } from './cli-demo.service';

@Module({
  controllers: [CliDemoController],
  providers: [CliDemoService]
})
export class CliDemoModule {}
