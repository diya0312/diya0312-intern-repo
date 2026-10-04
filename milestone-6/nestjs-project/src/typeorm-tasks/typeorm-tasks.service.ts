import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseTask } from './entities/database-task.entity';

@Injectable()
export class TypeormTasksService {
  constructor(
    @InjectRepository(DatabaseTask)
    private readonly taskRepository: Repository<DatabaseTask>,
  ) {}

  create(title: string) {
    const task = this.taskRepository.create({ title });
    return this.taskRepository.save(task);
  }

  findAll() {
    return this.taskRepository.find();
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, title: string) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      return undefined;
    }

    task.title = title;
    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      return undefined;
    }

    await this.taskRepository.remove(task);
    return task;
  }
}