import { TagEntity } from 'src/entities/tags.entity';
import { CategoryEntity } from './../entities/categories.entity';
import { PostEntity } from '../entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileEntity } from 'src/entities/files.entity';
import { UserEntity } from 'src/entities/users.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  async getAllPost(user: UserEntity, page: number, PAGE_SIZE: number) {
    return await this.postsRepository.find({
      where: {
        user_id: {
          id: user.id,
        },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      order: { updated_at: 'DESC' },
      relations: { tags: true },
    });
  }

  async getOnePost(id: number) {
    return await this.postsRepository.findOne({
      where: { id },
      relations: { tags: true, files: true, user_id: true },
    });
  }

  async getNextPost(user: UserEntity, post: PostEntity) {
    return await this.postsRepository
      .createQueryBuilder('post')
      .where('post.user_id = :id', { id: user.id })
      .andWhere('post.id > :post_id', {
        post_id: post.id,
      })
      .orderBy('post.id', 'ASC')
      .getOne();
  }

  async getPrevPost(user: UserEntity, post: PostEntity) {
    return await this.postsRepository
      .createQueryBuilder('post')
      .where('post.user_id = :id', { id: user.id })
      .andWhere('post.id < :post_id', {
        post_id: post.id,
      })
      .orderBy('post.id', 'DESC')
      .getOne();
  }

  async getAllPostCount(user: UserEntity) {
    return await this.postsRepository.count({
      where: {
        user_id: {
          id: user.id,
        },
      },
    });
  }

  async createPost(
    title: string,
    content: string,
    user: UserEntity,
    public_status: boolean,
    category: CategoryEntity,
    concatTags: TagEntity[],
    concatFiles: FileEntity[],
  ) {
    const post = this.postsRepository.create({
      title,
      content,
      user_id: user,
      public_status,
    });

    post.category_id = category;

    if (concatTags.length !== 0) {
      if (!post.tags) {
        post.tags = concatTags;
      } else {
        post.tags = post.tags.concat(concatTags);
      }
    }

    if (concatFiles.length !== 0) {
      if (!post.files) {
        post.files = concatFiles;
      } else {
        post.files = post.files.concat(concatFiles);
      }
    }

    await this.postsRepository.save(post);

    return post;
  }

  async updatePost(
    id: number,
    title: string,
    content: string,
    tags: TagEntity[],
    files: FileEntity[],
  ) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        tags: true,
        files: true,
      },
    });

    post.tags = tags;
    post.files = files;

    await this.postsRepository.save(post);

    return await this.postsRepository.update(id, {
      title,
      content,
    });
  }

  async updatePartialPost(id: number, public_status: boolean) {
    return await this.postsRepository.update(id, {
      public_status,
    });
  }

  async deletePost(id: number) {
    return this.postsRepository.delete(id);
  }

  async checkDuplicateFile(key: string) {
    const file = await this.filesRepository.findOne({
      where: {
        key,
      },
    });

    return file;
  }

  async uploadFile(key: string) {
    const file = await this.filesRepository.create({
      key,
    });

    await this.filesRepository.save(file);

    return file;
  }
}
