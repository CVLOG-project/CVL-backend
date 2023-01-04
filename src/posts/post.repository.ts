import { PostEntity } from './post.entity';
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
    return await this.postsRepository.find(user_id);
  }

  async getOnePost(id: number) {
    return await this.postsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async createPost(
    title: string,
    content: string,
    user_id: number,
    category_id: number,
    public_status: boolean,
  ) {
    const post = this.postsRepository.create({
      title,
      content,
      user_id,
      category_id,
      public_status,
    });

    await this.postsRepository.save(post);

    return post;
  }

  async updatePost(id: number, title: string, content: string) {
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

  deletePost(id: number) {
    return this.postsRepository.delete(id);
  }
}
