import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class N8nCallbackGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.N8N_CALLBACK_SECRET?.trim();
    if (!expected) {
      const message = 'N8N_CALLBACK_SECRET is not configured';
      if (process.env.NODE_ENV === 'production') {
        throw new InternalServerErrorException(message);
      }
      throw new UnauthorizedException(message);
    }

    const req = context.switchToHttp().getRequest<Request>();
    const provided = req.headers['x-n8n-callback-secret'];
    const headerValue = Array.isArray(provided) ? provided[0] : provided;

    if (!headerValue || headerValue !== expected) {
      throw new UnauthorizedException('Invalid callback secret');
    }

    return true;
  }
}
