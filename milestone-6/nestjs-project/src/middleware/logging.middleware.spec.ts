import { jest } from '@jest/globals';
import { Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { LoggingMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs the method and url, then passes the request on with next()', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    const next = jest.fn() as unknown as NextFunction;

    new LoggingMiddleware().use(
      { method: 'POST', url: '/tasks' } as Request,
      {} as Response,
      next,
    );

    expect(logSpy).toHaveBeenCalledWith('Middleware: POST /tasks');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
