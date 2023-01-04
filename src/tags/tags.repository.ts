import { TagEntity } from './../entities/tags.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectRepository(TagEntity)
    private tagsRepository: Repository<TagEntity>,
    @InjectDataSource()
    private datasource: DataSource,
  ) {}

  async getAllTag(user_id) {
    return await this.datasource
      .getRepository(TagEntity)
      .createQueryBuilder('tags')
      .leftJoin('tags.posts', 'posts')
      .where('posts.user_id = :user_id', { user_id })
      .orderBy('tags.name', 'ASC')
      .loadRelationCountAndMap('tags.postsCount', 'tags.posts')
      .getMany();
  }
}
