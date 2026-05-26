import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { AuthorsService } from './authors.service';
import { CategoriesService } from './categories.service';
import { CollectionsService } from './collections.service';
import { TagsService } from './tags.service';
import {
  AdminAuthorsController,
  AdminCategoriesController,
  AdminCollectionsController,
  AdminTagsController,
  AuthorsController,
  CategoriesController,
  CollectionsController,
  HomeController,
  TagsController,
} from './library.controllers';

@Module({
  imports: [UsersModule, StorageModule],
  controllers: [
    AuthorsController,
    CategoriesController,
    TagsController,
    CollectionsController,
    HomeController,
    AdminAuthorsController,
    AdminCategoriesController,
    AdminTagsController,
    AdminCollectionsController,
  ],
  providers: [AuthorsService, CategoriesService, TagsService, CollectionsService, RolesGuard],
})
export class LibraryModule {}
