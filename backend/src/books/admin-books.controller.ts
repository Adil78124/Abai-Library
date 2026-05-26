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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const PDF_MAX_SIZE = 100 * 1024 * 1024;
const IMAGE_MAX_SIZE = 10 * 1024 * 1024;

@Controller('admin/books')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminBooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() query: QueryBooksDto) {
    return this.booksService.findAllAdmin(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOneAdmin(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Post(':id/duplicate')
  @HttpCode(201)
  duplicate(@Param('id') id: string) {
    return this.booksService.duplicate(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.booksService.remove(id);
  }

  @Post(':id/upload/pdf')
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
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: IMAGE_MAX_SIZE } }),
  )
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.booksService.uploadImage(id, file);
  }

  @Delete(':id/pdf')
  deletePdf(@Param('id') id: string) {
    return this.booksService.deletePdf(id);
  }

  @Delete(':id/image')
  deleteImage(@Param('id') id: string) {
    return this.booksService.deleteImage(id);
  }
}
