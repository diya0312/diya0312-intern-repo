import { EncryptedData } from './encryption/encrypted-data.entity';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
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
    LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
    ],
  },
}),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().port().default(5434),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().default('nestjs_demo'),
        ENCRYPTION_KEY: Joi.string().hex().length(64).required(),
      }),
    }),
    // Application-level PostgreSQL connection using TypeORM.
    TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5434),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE ?? 'nestjs_demo',
  autoLoadEntities: true,
  synchronize: false,
}),

    // Redis connection for BullMQ background jobs.
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    TypeOrmModule.forFeature([EncryptedData]),
    BackgroundJobModule,
    TasksModule,
    CliDemoModule,
    TypeormTasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, HttpExceptionFilter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}



