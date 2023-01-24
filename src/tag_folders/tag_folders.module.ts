import { TagEntity } from 'src/entities/tags.entity';
import { UserEntity } from './../entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TagFolderEntity } from 'src/entities/tagFolders.entity';
import { TagFoldersController } from './tag_folders.controller';
import { TagFoldersRepository } from './tag_folders.repository';
import { TagFoldersService } from './tag_folders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagFolderEntity,
      TagFoldersRepository,
      TagFolderEntity,
      UserEntity,
      TagEntity,
    ]),
  ],
  controllers: [TagFoldersController],
  providers: [TagFoldersService, TagFoldersRepository],
})
export class TagFoldersModule {}
