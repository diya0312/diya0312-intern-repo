import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseTask } from './entities/database-task.entity';
import { TypeormTasksService } from './typeorm-tasks.service';

describe('TypeormTasksService (mocked TypeORM repository)', () => {
  let service: TypeormTasksService;

  // Only the repository methods the service actually uses are mocked.
  const mockRepository = {
    create: jest.fn<(data: Partial<DatabaseTask>) => DatabaseTask>(),
    save: jest.fn<(task: DatabaseTask) => Promise<DatabaseTask>>(),
    find: jest.fn<() => Promise<DatabaseTask[]>>(),
    findOneBy: jest.fn<(where: { id: number }) => Promise<DatabaseTask | null>>(),
    remove: jest.fn<(task: DatabaseTask) => Promise<DatabaseTask>>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeormTasksService,
        {
          // getRepositoryToken() gives the same token that @InjectRepository(DatabaseTask) uses.
          provide: getRepositoryToken(DatabaseTask),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TypeormTasksService>(TypeormTasksService);
  });

  it('create() builds the entity and saves it', async () => {
    const entity = { title: 'New task' } as DatabaseTask;
    mockRepository.create.mockReturnValue(entity);
    mockRepository.save.mockResolvedValue({ id: 1, title: 'New task' });

    const result = await service.create('New task');

    expect(mockRepository.create).toHaveBeenCalledWith({ title: 'New task' });
    expect(mockRepository.save).toHaveBeenCalledWith(entity);
    expect(result).toEqual({ id: 1, title: 'New task' });
  });

  it('findAll() returns every task from the repository', async () => {
    mockRepository.find.mockResolvedValue([
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
    ]);

    await expect(service.findAll()).resolves.toHaveLength(2);
    expect(mockRepository.find).toHaveBeenCalledTimes(1);
  });

  it('findOne() looks the task up by id', async () => {
    mockRepository.findOneBy.mockResolvedValue({ id: 5, title: 'Five' });

    await expect(service.findOne(5)).resolves.toEqual({ id: 5, title: 'Five' });
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 5 });
  });

  it('update() changes the title and saves the existing task', async () => {
    mockRepository.findOneBy.mockResolvedValue({ id: 2, title: 'Old' });
    mockRepository.save.mockImplementation(async (task) => task);

    const result = await service.update(2, 'New');

    expect(mockRepository.save).toHaveBeenCalledWith({ id: 2, title: 'New' });
    expect(result).toEqual({ id: 2, title: 'New' });
  });

  it('update() returns undefined and does not save when the task is missing', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.update(404, 'New')).resolves.toBeUndefined();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('remove() deletes an existing task and returns it', async () => {
    const task = { id: 3, title: 'Delete me' };
    mockRepository.findOneBy.mockResolvedValue(task);
    mockRepository.remove.mockResolvedValue(task);

    await expect(service.remove(3)).resolves.toEqual(task);
    expect(mockRepository.remove).toHaveBeenCalledWith(task);
  });

  it('remove() returns undefined and does not delete when the task is missing', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.remove(404)).resolves.toBeUndefined();
    expect(mockRepository.remove).not.toHaveBeenCalled();
  });

  it('passes database errors up to the caller', async () => {
    mockRepository.find.mockRejectedValue(new Error('Database connection lost'));

    await expect(service.findAll()).rejects.toThrow('Database connection lost');
  });
});
