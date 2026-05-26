import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AppLogger } from './app-logger';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new AppLogger(RequestLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = process.hrtime.bigint();

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const entry = {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Math.round(durationMs),
      };

      if (res.statusCode >= 500) {
        this.logger.error('http_request', entry);
      } else if (res.statusCode >= 400) {
        this.logger.warn('http_request', entry);
      } else {
        this.logger.log('http_request', entry);
      }
    });

    next();
  }
}
