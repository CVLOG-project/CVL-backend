import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comments.entity';
import { UserEntity } from 'src/entities/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, CommentsRepository, UserEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, UsersRepository],
})
export class CommentsModule {}
