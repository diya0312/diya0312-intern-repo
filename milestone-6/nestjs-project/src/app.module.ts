import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CliDemoModule } from './cli-demo/cli-demo.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [TasksModule, CliDemoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}