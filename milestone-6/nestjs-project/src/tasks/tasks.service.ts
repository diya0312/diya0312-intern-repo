import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [
    { id: 1, title: 'Learn NestJS modules' },
    { id: 2, title: 'Understand dependency injection' },
  ];

  getTasks() {
    return this.tasks;
  }

  getTask(id: number) {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(title: string) {
    const task = {
      id: this.tasks.length + 1,
      title,
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id: number, title: string) {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      return undefined;
    }

    task.title = title;
    return task;
  }

  deleteTask(id: number) {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return undefined;
    }

    const deletedTask = this.tasks[index];
    this.tasks.splice(index, 1);

    return deletedTask;
  }
}