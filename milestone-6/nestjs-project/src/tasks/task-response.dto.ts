import { Exclude } from 'class-transformer';

export class TaskResponseDto {
  id: number;
  title: string;

  @Exclude()
  internalNote: string;

  constructor(partial: Partial<TaskResponseDto>) {
    Object.assign(this, partial);
  }
}