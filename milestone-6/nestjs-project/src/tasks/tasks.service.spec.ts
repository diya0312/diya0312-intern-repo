import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('getTasks() returns the two starting tasks', () => {
    expect(service.getTasks()).toEqual([
      { id: 1, title: 'Learn NestJS modules' },
      { id: 2, title: 'Understand dependency injection' },
    ]);
  });

  it('getTask() finds a task by id', () => {
    expect(service.getTask(2)).toEqual({
      id: 2,
      title: 'Understand dependency injection',
    });
  });

  it('getTask() returns undefined for an id that does not exist', () => {
    expect(service.getTask(99)).toBeUndefined();
  });

  it('createTask() gives the new task the next id and stores it', () => {
    const task = service.createTask('Write strong tests');

    expect(task).toEqual({ id: 3, title: 'Write strong tests' });
    expect(service.getTasks()).toHaveLength(3);
    expect(service.getTask(3)).toEqual(task);
  });

  it('updateTask() changes only the title of the matching task', () => {
    expect(service.updateTask(1, 'Renamed')).toEqual({ id: 1, title: 'Renamed' });
    expect(service.getTask(1)?.title).toBe('Renamed');
    expect(service.getTask(2)?.title).toBe('Understand dependency injection');
  });

  it('updateTask() returns undefined and changes nothing when the id is missing', () => {
    expect(service.updateTask(99, 'Nope')).toBeUndefined();
    expect(service.getTasks().map((task) => task.title)).not.toContain('Nope');
  });

  it('deleteTask() removes the task and returns it', () => {
    expect(service.deleteTask(1)).toEqual({ id: 1, title: 'Learn NestJS modules' });
    expect(service.getTask(1)).toBeUndefined();
    expect(service.getTasks()).toHaveLength(1);
  });

  it('deleteTask() returns undefined and keeps all tasks when the id is missing', () => {
    expect(service.deleteTask(99)).toBeUndefined();
    expect(service.getTasks()).toHaveLength(2);
  });
});
