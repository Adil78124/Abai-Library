import 'dotenv/config';
import {
  BadRequestException,
  ValidationPipe,
  type ValidationError,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app-logger';
import { validateEnv } from './config/env.validation';

const logger = new AppLogger('Bootstrap');

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function parseBooleanEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be "true" or "false"`);
}

function requireProductionSecret(name: string): string {
  const value = requireEnv(name);
  if (process.env.NODE_ENV === 'production' && value.length < 32) {
    throw new Error(`${name} must be at least 32 characters in production`);
  }
  return value;
}

function getCorsOrigin(): string | string[] {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) {
    return 'http://localhost:3000';
  }
  const origins = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (origins.some((origin) => origin === '*')) {
    throw new Error('CORS_ORIGIN cannot include wildcard "*" when credentials are enabled');
  }
  return origins;
}

function getCookieSameSite(): 'lax' | 'strict' | 'none' {
  const raw = (process.env.COOKIE_SAME_SITE?.trim().toLowerCase() || 'lax') as
    | 'lax'
    | 'strict'
    | 'none';
  if (!['lax', 'strict', 'none'].includes(raw)) {
    throw new Error('COOKIE_SAME_SITE must be one of: lax, strict, none');
  }
  return raw;
}

function getCookieConfig() {
  const secure = parseBooleanEnv(
    'COOKIE_SECURE',
    process.env.NODE_ENV === 'production',
  );
  const sameSite = getCookieSameSite();
  if (sameSite === 'none' && !secure) {
    throw new Error('COOKIE_SAME_SITE=none requires COOKIE_SECURE=true');
  }
  const domain = process.env.COOKIE_DOMAIN?.trim();
  return {
    httpOnly: true,
    sameSite,
    secure,
    ...(domain ? { domain } : {}),
  };
}

async function bootstrap() {
  validateEnv();
  const sessionSecret = requireProductionSecret('SESSION_SECRET');
  const redisUrl = requireEnv('REDIS_URL');

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production') {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: getCorsOrigin(),
    credentials: true,
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const first = validationErrors?.[0];
        const message = first?.constraints
          ? Object.values(first.constraints)[0]
          : first?.children?.[0]?.constraints
            ? Object.values(first.children[0].constraints)[0]
            : 'Ошибка валидации';
        return new BadRequestException(message);
      },
    }),
  );

  const redisClient = createClient({ url: redisUrl });
  redisClient.on('error', (err) =>
    logger.error('redis_error', {
      message: err instanceof Error ? err.message : 'unknown redis error',
    }),
  );
  await redisClient.connect();

  const sessionName = process.env.SESSION_NAME?.trim() || 'sid';
  const maxAge = Number(
    process.env.SESSION_MAX_AGE ?? 30 * 24 * 60 * 60 * 1000,
  );

  app.use(
    session({
      name: sessionName,
      store: new RedisStore({ client: redisClient }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        ...getCookieConfig(),
        maxAge,
      },
    }),
  );

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  logger.log('backend_started', { port, basePath: '/api' });
}

bootstrap();
