import { jest } from '@jest/globals';
import { CallHandler, ExecutionContext, Logger, NotFoundException } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { redactHeaders } from './redact-headers';
import { RequestInspectionController } from './request-inspection.controller';
import { ResponseInspectionInterceptor } from './response-inspection.interceptor';

describe('Request inspection', () => {
  let logSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('redactHeaders()', () => {
    it('hides sensitive headers but keeps the rest', () => {
      expect(
        redactHeaders({
          Authorization: 'Bearer secret',
          cookie: 'session=abc',
          'x-api-key': 'key',
          'content-type': 'application/json',
        }),
      ).toEqual({
        Authorization: '[REDACTED]',
        cookie: '[REDACTED]',
        'x-api-key': '[REDACTED]',
        'content-type': 'application/json',
      });
    });
  });

  describe('RequestInspectionController', () => {
    const controller = new RequestInspectionController();

    it('echo() logs the payload and redacted headers, then echoes the body', () => {
      const result = controller.echo(
        { title: 'Deep work' },
        { 'content-type': 'application/json', authorization: 'Bearer secret' },
      );

      expect(result).toEqual({ received: { title: 'Deep work' }, contentType: 'application/json' });
      expect(logSpy).toHaveBeenCalledWith('Payload: {"title":"Deep work"}');
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"authorization":"[REDACTED]"'));
      expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('Bearer secret'));
    });

    it('echo() returns null contentType when the header is missing', () => {
      expect(controller.echo({}, {}).contentType).toBeNull();
    });

    it('getItem() returns an existing item', () => {
      expect(controller.getItem(1)).toEqual({ id: 1, name: 'Morning routine' });
    });

    it('getItem() throws 404 for a missing item instead of returning an empty 200', () => {
      expect(() => controller.getItem(99)).toThrow(NotFoundException);
      expect(() => controller.getItem(99)).toThrow('Item 99 not found');
    });
  });

  describe('ResponseInspectionInterceptor', () => {
    it('adds debug headers and logs status, time and body size', async () => {
      const response = { statusCode: 201, setHeader: jest.fn() };
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ method: 'POST', url: '/inspect/echo' }),
          getResponse: () => response,
        }),
      } as unknown as ExecutionContext;
      const next: CallHandler = { handle: () => of({ ok: true }) };

      const body = await firstValueFrom(new ResponseInspectionInterceptor().intercept(context, next));

      expect(body).toEqual({ ok: true });
      expect(response.setHeader).toHaveBeenCalledWith('X-Response-Time', expect.stringMatching(/^\d+ms$/));
      expect(response.setHeader).toHaveBeenCalledWith('X-Inspected-By', 'ResponseInspectionInterceptor');
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^POST \/inspect\/echo -> 201 in \d+ms, body 11 bytes$/),
      );
    });

    it('counts an empty response body as "null"', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ method: 'GET', url: '/x' }),
          getResponse: () => ({ statusCode: 200, setHeader: jest.fn() }),
        }),
      } as unknown as ExecutionContext;

      await firstValueFrom(
        new ResponseInspectionInterceptor().intercept(context, { handle: () => of(undefined) }),
      );

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('body 4 bytes'));
    });
  });
});
