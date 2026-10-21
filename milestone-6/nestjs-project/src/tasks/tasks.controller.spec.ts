import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

type Task = { id: number; title: string };

describe('TasksController (mocked TasksService)', () => {
  let controller: TasksController;

  // jest.fn() creates standalone mock functions that replace the real service methods.
  const mockTasksService = {
    getTasks: jest.fn<() => Task[]>(),
    getTask: jest.fn<(id: number) => Task | undefined>(),
    createTask: jest.fn<(title: string) => Task>(),
    updateTask: jest.fn<(id: number, title: string) => Task | undefined>(),
    deleteTask: jest.fn<(id: number) => Task | undefined>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('getTasks() returns the tasks provided by the service', () => {
    const tasks = [{ id: 1, title: 'Mocked task' }];
    mockTasksService.getTasks.mockReturnValue(tasks);

    expect(controller.getTasks()).toEqual(tasks);
    expect(mockTasksService.getTasks).toHaveBeenCalledTimes(1);
  });

  it('getTask() passes the id to the service', () => {
    mockTasksService.getTask.mockReturnValue({ id: 7, title: 'Task 7' });

    expect(controller.getTask(7)).toEqual({ id: 7, title: 'Task 7' });
    expect(mockTasksService.getTask).toHaveBeenCalledWith(7);
  });

  it('createTask() sends only the title from the DTO to the service', () => {
    mockTasksService.createTask.mockReturnValue({ id: 3, title: 'Write tests' });

    const result = controller.createTask({ title: 'Write tests' });

    expect(mockTasksService.createTask).toHaveBeenCalledWith('Write tests');
    expect(result).toEqual({ id: 3, title: 'Write tests' });
  });

  it('updateTask() passes both the id and the new title', () => {
    mockTasksService.updateTask.mockReturnValue({ id: 1, title: 'Updated' });

    expect(controller.updateTask(1, { title: 'Updated' })).toEqual({
      id: 1,
      title: 'Updated',
    });
    expect(mockTasksService.updateTask).toHaveBeenCalledWith(1, 'Updated');
  });

  it('deleteTask() returns undefined when the service cannot find the task', () => {
    mockTasksService.deleteTask.mockReturnValue(undefined);

    expect(controller.deleteTask(99)).toBeUndefined();
    expect(mockTasksService.deleteTask).toHaveBeenCalledWith(99);
  });
});

describe('TasksController (jest.spyOn on the real TasksService)', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('spyOn watches the real method and still runs the real code', () => {
    const spy = jest.spyOn(service, 'createTask');

    const result = controller.createTask({ title: 'Spied task' });

    expect(spy).toHaveBeenCalledWith('Spied task');
    // The real service ran, so the task got the next real id (3).
    expect(result).toEqual({ id: 3, title: 'Spied task' });
  });

  it('spyOn can also replace the real method for one test', () => {
    jest.spyOn(service, 'getTasks').mockReturnValue([]);

    expect(controller.getTasks()).toEqual([]);
  });
});
