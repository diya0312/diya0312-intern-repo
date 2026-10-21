import { instanceToPlain } from 'class-transformer';
import { TaskResponseDto } from './task-response.dto';

describe('TaskResponseDto', () => {
  it('copies the given fields onto the DTO', () => {
    const dto = new TaskResponseDto({ id: 1, title: 'Task', internalNote: 'secret' });

    expect(dto.id).toBe(1);
    expect(dto.title).toBe('Task');
  });

  it('hides internalNote when serialized for the API response', () => {
    const dto = new TaskResponseDto({ id: 1, title: 'Task', internalNote: 'secret' });

    expect(instanceToPlain(dto)).toEqual({ id: 1, title: 'Task' });
  });
});
