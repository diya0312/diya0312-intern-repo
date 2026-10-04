import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormTasksController } from './typeorm-tasks.controller';
import { TypeormTasksService } from './typeorm-tasks.service';
import { DatabaseTask } from './entities/database-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseTask])],
  controllers: [TypeormTasksController],
  providers: [TypeormTasksService],
})
export class TypeormTasksModule {}