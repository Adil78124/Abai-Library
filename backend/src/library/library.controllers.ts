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
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { AuthorsService } from './authors.service';
import { CategoriesService } from './categories.service';
import { CollectionsService } from './collections.service';
import { TagsService } from './tags.service';
import {
  AddCollectionBookDto,
  CreateAuthorDto,
  CreateCategoryDto,
  CreateCollectionDto,
  CreateTagDto,
  ListQueryDto,
  ReorderCollectionBooksDto,
  UpdateAuthorDto,
  UpdateCategoryDto,
  UpdateCollectionDto,
  UpdateTagDto,
} from './library.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authors: AuthorsService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.authors.findAll(query);
  }
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.categories.findAll(query, true);
  }
}

@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.tags.findAll(query);
  }
}

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collections: CollectionsService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.collections.findAll(query, true);
  }

  @Get(':slug/books')
  findBooks(@Param('slug') slug: string) {
    return this.collections.getBooksBySlug(slug);
  }
}

@Controller('home')
export class HomeController {
  constructor(private readonly collections: CollectionsService) {}

  @Get()
  getHome() {
    return this.collections.getHome();
  }
}

@Controller('admin/authors')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminAuthorsController {
  constructor(private readonly authors: AuthorsService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.authors.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authors.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateAuthorDto) {
    return this.authors.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authors.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.authors.remove(id);
  }
}

@Controller('admin/categories')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.categories.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categories.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categories.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.categories.remove(id);
  }
}

@Controller('admin/tags')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.tags.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tags.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateTagDto) {
    return this.tags.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tags.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.tags.remove(id);
  }
}

@Controller('admin/collections')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCollectionsController {
  constructor(private readonly collections: CollectionsService) {}

  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.collections.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collections.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateCollectionDto) {
    return this.collections.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collections.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.collections.remove(id);
  }

  @Post(':id/books')
  @HttpCode(201)
  addBook(@Param('id') id: string, @Body() dto: AddCollectionBookDto) {
    return this.collections.addBook(id, dto);
  }

  @Patch(':id/books/reorder')
  reorderBooks(
    @Param('id') id: string,
    @Body() dto: ReorderCollectionBooksDto,
  ) {
    return this.collections.reorderBooks(id, dto);
  }

  @Delete(':id/books/:bookId')
  @HttpCode(204)
  async removeBook(@Param('id') id: string, @Param('bookId') bookId: string) {
    await this.collections.removeBook(id, bookId);
  }
}
