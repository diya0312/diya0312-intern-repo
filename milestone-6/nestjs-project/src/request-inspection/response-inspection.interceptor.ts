import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ResponseInspectionInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ResponseInspection');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startTime = Date.now();

    return next.handle().pipe(
      tap((body) => {
        const duration = Date.now() - startTime;

        // Modify the response: add debugging headers the client can see.
        response.setHeader('X-Response-Time', `${duration}ms`);
        response.setHeader('X-Inspected-By', 'ResponseInspectionInterceptor');

        // Analyze the response: log status, timing and body size.
        this.logger.log(
          `${request.method} ${request.url} -> ${response.statusCode} in ${duration}ms, body ${JSON.stringify(body ?? null).length} bytes`,
        );
      }),
    );
  }
}
