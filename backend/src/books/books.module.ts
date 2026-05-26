import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { N8nCallbackGuard } from '../common/guards/n8n-callback.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { N8nModule } from '../n8n/n8n.module';
import { UsersModule } from '../users/users.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { AdminBooksController } from './admin-books.controller';

@Module({
  imports: [
    N8nModule,
    UsersModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [BooksController, AdminBooksController],
  providers: [BooksService, RolesGuard, N8nCallbackGuard],
  exports: [BooksService],
})
export class BooksModule {}
