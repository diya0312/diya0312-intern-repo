import { Module } from '@nestjs/common';
import { RequestInspectionController } from './request-inspection.controller';

@Module({
  controllers: [RequestInspectionController],
})
export class RequestInspectionModule {}
