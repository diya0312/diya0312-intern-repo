import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TaskSeed } from './entities/task-seed.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5434),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE ?? 'nestjs_demo',
  entities: [TaskSeed],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
  synchronize: false,
});