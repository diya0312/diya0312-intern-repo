import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { BackgroundJobModule } from './background-jobs/background-job.module';
import { AppController } from './app.controller';
import { TypeormTasksModule } from './typeorm-tasks/typeorm-tasks.module';
import { AppService } from './app.service';
import { CliDemoModule } from './cli-demo/cli-demo.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'localdevpassword',
      database: 'nestjs_demo',
      autoLoadEntities: true,
      synchronize: false,
    }),
    BullModule.forRoot({
  connection: {
    host: 'localhost',
    port: 6379,
   },
   }),
    BackgroundJobModule,
    TasksModule,
    CliDemoModule,
    TypeormTasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}