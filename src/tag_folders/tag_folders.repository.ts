import { TagFolderEntity } from './../entities/tagFolders.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/entities/users.entity';

@Injectable()
export class TagFoldersRepository {
  constructor(
    @InjectRepository(TagFolderEntity)
    private tagFoldersRepository: Repository<TagFolderEntity>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getAllFolder(user_id: number) {
    return await this.dataSource
      .getRepository(TagFolderEntity)
      .createQueryBuilder('tag_folders')
      .where('tag_folders.user_id = :user_id', { user_id })
      .leftJoinAndSelect('tag_folders.tags', 'tags')
      .leftJoin('tags.posts', 'posts')
      .orderBy('tag_folders.name', 'ASC')
      .loadRelationCountAndMap('tags.postsCount', 'tags.posts')
      .loadRelationCountAndMap('tag_folders.tagsCount', 'tag_folders.tags')
      .getMany();
  }

  async getOneFolderByUserId(name: string, user: UserEntity) {
    return await this.tagFoldersRepository.findOne({
      where: {
        name,
        user_id: {
          id: user.id,
        },
      },
    });
  }

  async getOneFolderById(id: number, user: UserEntity) {
    return await this.tagFoldersRepository.findOne({
      where: {
        id,
        user_id: {
          id: user.id,
        },
      },
    });
  }

  async createFolder(name: string, user: UserEntity) {
    const folder = await this.tagFoldersRepository.create({
      name,
    });

    folder.user_id = user;

    await this.tagFoldersRepository.save(folder);

    return folder;
  }

  async updateFolder(id: number, name: string) {
    return await this.tagFoldersRepository.update(id, {
      name,
    });
  }

  async deleteFolder(id: number) {
    return await this.tagFoldersRepository.delete(id);
  }
}
