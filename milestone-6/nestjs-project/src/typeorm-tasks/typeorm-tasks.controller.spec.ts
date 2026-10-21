import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormTasksController } from './typeorm-tasks.controller';
import { TypeormTasksService } from './typeorm-tasks.service';

describe('TypeormTasksController (mocked service)', () => {
  let controller: TypeormTasksController;
  const task = { id: 1, title: 'Saved task' };
  const mockService = {
    create: jest.fn<(title: string) => Promise<typeof task>>(),
    findAll: jest.fn<() => Promise<(typeof task)[]>>(),
    findOne: jest.fn<(id: number) => Promise<typeof task | null>>(),
    update: jest.fn<(id: number, title: string) => Promise<typeof task | undefined>>(),
    remove: jest.fn<(id: number) => Promise<typeof task | undefined>>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeormTasksController],
      providers: [{ provide: TypeormTasksService, useValue: mockService }],
    }).compile();

    controller = module.get<TypeormTasksController>(TypeormTasksController);
  });

  it('create() passes the title to the service', async () => {
    mockService.create.mockResolvedValue(task);

    await expect(controller.create('Saved task')).resolves.toEqual(task);
    expect(mockService.create).toHaveBeenCalledWith('Saved task');
  });

  it('findAll() returns all tasks from the service', async () => {
    mockService.findAll.mockResolvedValue([task]);

    await expect(controller.findAll()).resolves.toEqual([task]);
  });

  it('findOne() passes the id to the service', async () => {
    mockService.findOne.mockResolvedValue(task);

    await expect(controller.findOne(1)).resolves.toEqual(task);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('update() passes the id and title to the service', async () => {
    mockService.update.mockResolvedValue({ id: 1, title: 'New' });

    await expect(controller.update(1, 'New')).resolves.toEqual({ id: 1, title: 'New' });
    expect(mockService.update).toHaveBeenCalledWith(1, 'New');
  });

  it('remove() passes the id to the service', async () => {
    mockService.remove.mockResolvedValue(task);

    await expect(controller.remove(1)).resolves.toEqual(task);
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
