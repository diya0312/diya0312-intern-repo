import { jest } from '@jest/globals';
import { CallHandler, ExecutionContext, Logger } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs the request and response and returns the response unchanged', async () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ method: 'GET', url: '/tasks' }) }),
    } as unknown as ExecutionContext;
    const next: CallHandler = { handle: () => of({ id: 1, title: 'Task' }) };

    const result = await firstValueFrom(new LoggingInterceptor().intercept(context, next));

    expect(result).toEqual({ id: 1, title: 'Task' });
    expect(logSpy).toHaveBeenCalledWith('Request: GET /tasks');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^Response: GET \/tasks - \d+ms - {"id":1,"title":"Task"}$/),
    );
  });
});
