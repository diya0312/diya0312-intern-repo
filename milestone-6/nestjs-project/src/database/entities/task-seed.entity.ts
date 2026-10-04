import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('task_seed')
export class TaskSeed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}