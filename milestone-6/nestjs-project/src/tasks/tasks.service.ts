import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  getTasks() {
    return ['Learn NestJS modules', 'Understand dependency injection'];
  }
}
