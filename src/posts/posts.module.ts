import { FileEntity } from './../entities/files.entity';
import { UserEntity } from './../entities/users.entity';
import { TagEntity } from 'src/entities/tags.entity';
import { CategoryEntity } from './../entities/categories.entity';
import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from '../entities/posts.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { AwsService } from './aws.service';
import * as multer from 'multer';
import { TagFoldersRepository } from 'src/tag_folders/tag_folders.repository';
import { TagFolderEntity } from 'src/entities/tagFolders.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './upload',
      storage: multer.memoryStorage(),
    }),
    TypeOrmModule.forFeature([
      PostEntity,
      PostsRepository,
      CategoryEntity,
      TagEntity,
      UserEntity,
      FileEntity,
      TagFolderEntity,
      TagFoldersRepository,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, AwsService, TagFoldersRepository],
})
export class PostsModule {}
