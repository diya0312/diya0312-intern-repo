import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('typeorm_tasks')
export class DatabaseTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}