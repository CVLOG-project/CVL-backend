import { TagEntity } from 'src/entities/tags.entity';
import { CategoryEntity } from './../entities/categories.entity';
import { PostEntity } from '../entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileEntity } from 'src/entities/files.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  async getAllPost(user_id) {
    return await this.postsRepository.find({
      where: { user_id },
      relations: { tags: true },
    });
  }

  async getOnePost(id: number) {
    return await this.postsRepository.findOne({
      where: { id },
      relations: { tags: true, files: true },
    });
  }

  async createPost(
    title: string,
    content: string,
    user_id: number,
    public_status: boolean,
    category: CategoryEntity,
    concatTags: TagEntity[],
    concatFiles: FileEntity[],
  ) {
    const post = this.postsRepository.create({
      title,
      content,
      user_id,
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

  async updateFile(id: number, fileName: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        files: true,
      },
    });

    return 'upload File';
  }
}
