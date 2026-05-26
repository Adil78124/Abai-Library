import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { N8nCallbackGuard } from '../common/guards/n8n-callback.guard';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { BooksService } from './books.service';
import { BookChatDto } from './dto/book-chat.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { EndUploadDto } from './dto/end-upload.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const PDF_MAX_SIZE = 100 * 1024 * 1024;
const IMAGE_MAX_SIZE = 10 * 1024 * 1024;

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() query: QueryBooksDto) {
    return this.booksService.findAllPublic(query);
  }

  @Get('admin/list')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdmin(@Query() query: QueryBooksDto) {
    return this.booksService.findAllAdmin(query);
  }

  @Post()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(201)
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Post(':id/upload/pdf')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: PDF_MAX_SIZE } }),
  )
  uploadPdf(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.booksService.uploadPdf(id, file);
  }

  @Post(':id/upload/image')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: IMAGE_MAX_SIZE } }),
  )
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.booksService.uploadImage(id, file);
  }

  @Post(':id/chat')
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      ttl: 60_000,
      limit: Number(process.env.AI_CHAT_RATE_LIMIT_PER_MINUTE ?? 20),
    },
  })
  @HttpCode(200)
  chat(
    @Param('id') id: string,
    @Body() dto: BookChatDto,
    @Req() req: Request,
  ) {
    return this.booksService.chatWithBook(id, dto, req.session?.userId);
  }

  @Post(':id/end_upload')
  @UseGuards(N8nCallbackGuard)
  @HttpCode(200)
  endUpload(@Param('id') id: string, @Body() dto: EndUploadDto) {
    return this.booksService.completeUploadProcessing(
      id,
      dto.success,
      dto.error,
    );
  }

  @Delete(':id/pdf')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deletePdf(@Param('id') id: string) {
    return this.booksService.deletePdf(id);
  }

  @Delete(':id/image')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deleteImage(@Param('id') id: string) {
    return this.booksService.deleteImage(id);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string, @Req() req: Request) {
    return this.booksService.findOnePublic(idOrSlug, req.session?.userId);
  }

  @Patch(':id')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.booksService.remove(id);
  }
}
