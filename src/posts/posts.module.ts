import { CategoryEntity } from './../entities/categories.entity';
import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from '../entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, PostsRepository, CategoryEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
