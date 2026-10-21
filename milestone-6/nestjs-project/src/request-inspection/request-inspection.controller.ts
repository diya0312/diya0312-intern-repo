import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { redactHeaders } from './redact-headers';
import { ResponseInspectionInterceptor } from './response-inspection.interceptor';

@Controller('inspect')
@UseInterceptors(ResponseInspectionInterceptor)
export class RequestInspectionController {
  private readonly logger = new Logger('RequestInspection');

  private readonly items = [
    { id: 1, name: 'Morning routine' },
    { id: 2, name: 'Focus session' },
  ];

  @Post('echo')
  echo(
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    // Log the payload and headers so we can see exactly what the client sent.
    this.logger.log(`Payload: ${JSON.stringify(body)}`);
    this.logger.log(`Headers: ${JSON.stringify(redactHeaders(headers))}`);

    return { received: body, contentType: headers['content-type'] ?? null };
  }

  @Get('items/:id')
  getItem(@Param('id', ParseIntPipe) id: number) {
    const item = this.items.find((entry) => entry.id === id);

    // Fix: returning undefined made Nest send 200 with an empty body.
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }

    return item;
  }
}
