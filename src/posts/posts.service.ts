import { CategoryEntity } from './../entities/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRequestDto } from './posts.request.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostEntity } from '../entities/posts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
    private readonly postsRepository: PostsRepository,
  ) {}

  async getAllPost() {
    const user_id = 1; //after complete jwt, insert decoding user_id

    return this.postsRepository.getAllPost(user_id);
  }

  async getOnePost(id: number): Promise<PostEntity> {
    const found = this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't find post with id: ${id}`);
    }

    return found;
  }

  async createPost(body: PostRequestDto) {
    const { title, content, user_id, category_id, public_status } = body;

    const category = await this.categoriesRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new NotFoundException(
        `Can't find category with category_id: ${category_id}`,
      );
    }

    return await this.postsRepository.createPost(
      title,
      content,
      user_id,
      public_status,
      category,
    );
  }

  async updatePost(id: number, body: PostRequestDto) {
    const { title, content } = body;

    const found = await this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't not find post with id: ${id}`);
    }

    const modifyCheck = await this.postsRepository.getOnePost(id);

    if (modifyCheck.title === title && modifyCheck.content === content) {
      throw new BadRequestException('No modifications have been made');
    }

    return await this.postsRepository.updatePost(id, title, content);
  }

  async updatePartialPost(id: number, public_status: boolean) {
    const found = await this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't not find post with id: ${id}`);
    }

    if (found.public_status === public_status) {
      throw new BadRequestException(
        `Public_status is already an ${public_status}`,
      );
    }

    return await this.postsRepository.updatePartialPost(id, public_status);
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.deletePost(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Can't not find post with id: ${id}`);
    }

    return result;
  }
}
