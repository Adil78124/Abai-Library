import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { RequestLoggingMiddleware } from './common/logger/request-logging.middleware';
import { HealthModule } from './health/health.module';
import { N8nModule } from './n8n/n8n.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: Number(process.env.DEFAULT_RATE_LIMIT_PER_MINUTE ?? 100),
      },
    ]),
    PrismaModule,
    StorageModule,
    N8nModule,
    UsersModule,
    AuthModule,
    BooksModule,
    LibraryModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('{*path}');
  }
}
