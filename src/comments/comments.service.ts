import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/entities/users.entity';
import { CommentRequestDto } from './comments.dto';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async getOneComment(post_id: number) {
    return await this.commentsRepository.getCommentByPostId(post_id);
  }

  async createComment(body, user_id) {
    const { content, post_id } = body;

    const result = await this.commentsRepository.createComment(
      content,
      user_id,
      post_id,
    );

    return result;
  }

  async updateComment(id: number, body: CommentRequestDto, user: UserEntity) {
    const { content } = body;

    await this.commentsRepository.updateComment(id, content);
  }

  async deletePost(id: number) {
    const comment = await this.commentsRepository.getOneComment(id);

    if (!comment) {
      throw new NotFoundException(`Comment with id: ${id} not found.`);
    }
    await this.commentsRepository.deleteComment(id);
  }
}
