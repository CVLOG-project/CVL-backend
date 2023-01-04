import { PostsRepository } from './../posts/posts.repository';
import { CategoryEntity } from './../entities/categories.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, PostsRepository])],
})
export class CategoriesModule {}
