import { TagEntity } from 'src/entities/tags.entity';
import { CategoryEntity } from './../entities/categories.entity';
import { PostEntity } from '../entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
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
      relations: { tags: true },
    });
  }

  async createPost(
    title: string,
    content: string,
    user_id: number,
    public_status: boolean,
    category: CategoryEntity,
    concatTags: TagEntity[],
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

    await this.postsRepository.save(post);

    return post;
  }

  async updatePost(
    id: number,
    title: string,
    content: string,
    tags: TagEntity[],
  ) {
    // return await this.postsRepository.update(id, {
    //   title,
    //   content,
    // });

    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        tags: true,
      },
    });

    post.tags = tags;

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
}
