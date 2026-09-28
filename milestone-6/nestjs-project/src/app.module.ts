import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksModule } from './tasks/tasks.module';
import { CliDemoController } from './cli-demo/cli-demo.controller';
import { CliDemoService } from './cli-demo/cli-demo.service';
import { CliDemoModule } from './cli-demo/cli-demo.module';

@Module({
  imports: [TasksModule, CliDemoModule],
  controllers: [AppController, TasksController, CliDemoController],
  providers: [AppService, TasksService, CliDemoService],
})
export class AppModule {}
