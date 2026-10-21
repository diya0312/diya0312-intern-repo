import { jest } from '@jest/globals';
import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import type { PinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  const logger = { error: jest.fn() };
  const response = {
    status: jest.fn<(code: number) => unknown>(),
    json: jest.fn<(body: unknown) => unknown>(),
  };
  const request = { method: 'GET', url: '/test-path' };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost;

  let filter: HttpExceptionFilter;

  beforeEach(() => {
    jest.clearAllMocks();
    response.status.mockReturnValue(response);
    filter = new HttpExceptionFilter(logger as unknown as PinoLogger);
  });

  const sentBody = () => response.json.mock.calls[0][0] as Record<string, unknown>;

  it('uses the status and message of an HttpException', () => {
    filter.catch(new UnauthorizedException('Token missing'), host);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sentBody()).toMatchObject({
      statusCode: 401,
      path: '/test-path',
      message: 'Token missing',
    });
    expect(typeof sentBody().timestamp).toBe('string');
  });

  it('keeps the list of validation messages from a BadRequestException', () => {
    filter.catch(
      new BadRequestException(['title must be a string', 'title should not be empty']),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(sentBody().message).toEqual([
      'title must be a string',
      'title should not be empty',
    ]);
  });

  it('uses a plain string response as the message', () => {
    filter.catch(new HttpException('Teapot error', 418), host);

    expect(sentBody()).toMatchObject({ statusCode: 418, message: 'Teapot error' });
  });

  it('falls back to "Request failed" when the response has no usable message', () => {
    filter.catch(new HttpException({ error: 'No message here' }, 409), host);
    expect(sentBody().message).toBe('Request failed');

    jest.clearAllMocks();
    response.status.mockReturnValue(response);
    filter.catch(new HttpException({ message: { nested: true } }, 409), host);
    expect(sentBody().message).toBe('Request failed');
  });

  it('turns an unexpected error into a safe 500 response and logs the real error', () => {
    const error = new Error('Database password is wrong');

    filter.catch(error, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(sentBody().message).toBe('Internal server error');
    expect(JSON.stringify(sentBody())).not.toContain('Database password');
    expect(logger.error).toHaveBeenCalledWith(
      { err: error, method: 'GET', path: '/test-path', statusCode: 500 },
      'HTTP request failed',
    );
  });
});
