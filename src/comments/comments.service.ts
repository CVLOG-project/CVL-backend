import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async getCommentsByPostId(post_id: number) {
    return await this.commentsRepository.getCommentsByPostId(post_id);
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
}
