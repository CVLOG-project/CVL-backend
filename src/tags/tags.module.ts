import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagEntity } from 'src/entities/tags.entity';
import { TagsRepository } from './tags.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, TagsRepository])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
})
export class TagsModule {}
