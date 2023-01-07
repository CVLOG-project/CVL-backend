import { PostRequestDto } from './posts.request.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './post.repository';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  getAllPost() {
    const user_id = 1; //after complete jwt, insert decoding user_id

    return this.postsRepository.getAllPost(user_id);
  }

  getOnePost(id: number): Promise<PostEntity> {
    const found = this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't find post with id: ${id}`);
    }

    return found;
  }

  async createPost(body: PostRequestDto) {
    const { title, content, user_id, category_id, public_status } = body;

    return await this.postsRepository.createPost(
      title,
      content,
      user_id,
      category_id,
      public_status,
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
