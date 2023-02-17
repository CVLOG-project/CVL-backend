import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comments.entity';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
  ) {}

  async getCommentsByPostId(post_id) {
    return await this.commentsRepository
      .createQueryBuilder('comments')
      .select([
        'comments.id',
        'comments.content',
        'comments.created_at',
        'user.id',
        'user.github_id',
        'user.profile_image',
      ])
      .leftJoin('comments.user_id', 'user')
      .where({ post_id })
      .getMany();
  }

  async createComment(
    content: string,
    user_id: UserEntity,
    post_id: CommentEntity,
  ) {
    const comment = this.commentsRepository.create({
      content,
      user_id,
      post_id,
    });

    await this.commentsRepository.save(comment);

    return comment;
  }
}
