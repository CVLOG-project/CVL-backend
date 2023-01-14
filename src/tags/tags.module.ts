import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagEntity } from 'src/entities/tags.entity';
import { TagsRepository } from './tags.repository';
import { UserEntity } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, TagsRepository, UserEntity])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
})
export class TagsModule {}
