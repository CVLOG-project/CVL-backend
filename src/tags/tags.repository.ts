import { TagEntity } from './../entities/tags.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/entities/users.entity';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectRepository(TagEntity)
    private tagsRepository: Repository<TagEntity>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getAllTag(user_id) {
    return await this.dataSource
      .getRepository(TagEntity)
      .createQueryBuilder('tags')
      .leftJoin('tags.posts', 'posts')
      .where('posts.user_id = :user_id', { user_id })
      .orderBy('tags.name', 'ASC')
      .loadRelationCountAndMap('tags.postsCount', 'tags.posts')
      .getMany();
  }

  async getOneTagByName(user: UserEntity, name: string) {
    return await this.dataSource
      .getRepository(TagEntity)
      .createQueryBuilder('tags')
      .leftJoin('tags.posts', 'posts')
      .where('posts.user_id = :user', { user: user.id })
      .andWhere('tags.name = :name', { name })
      .getOne();
  }

  async getOneTagById(user: UserEntity, tag_id: number) {
    return await this.dataSource
      .getRepository(TagEntity)
      .createQueryBuilder('tags')
      .leftJoin('tags.posts', 'posts')
      .where('posts.user_id = :user', { user: user.id })
      .andWhere('tags.id = :id', { id: tag_id })
      .getOne();
  }

  async createTag(name: string) {
    const tag = await this.tagsRepository.create({
      name,
    });

    await this.tagsRepository.save(tag);

    return tag;
  }

  async updateTag(tag_id: number, folder_id: number) {
    return await this.tagsRepository.update(tag_id, {
      folder_id: {
        id: folder_id,
      },
    });
  }
}
