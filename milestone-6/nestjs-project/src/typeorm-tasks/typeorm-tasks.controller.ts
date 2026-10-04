import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TypeormTasksService } from './typeorm-tasks.service';

@Controller('typeorm-tasks')
export class TypeormTasksController {
  constructor(
    private readonly typeormTasksService: TypeormTasksService,
  ) {}

  @Post()
  create(@Body('title') title: string) {
    return this.typeormTasksService.create(title);
  }

  @Get()
  findAll() {
    return this.typeormTasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeormTasksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title: string,
  ) {
    return this.typeormTasksService.update(id, title);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.typeormTasksService.remove(id);
  }
}