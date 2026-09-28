import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks() {
    return this.tasksService.getTasks();
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.tasksService.getTask(Number(id));
  }

  @Post()
  createTask(@Body('title') title: string) {
    return this.tasksService.createTask(title);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body('title') title: string) {
    return this.tasksService.updateTask(Number(id), title);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(Number(id));
  }
}