import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { GetUser } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserEntity } from 'src/entities/users.entity';
import { CommentRequestDto } from './comments.dto';
import { CommentsService } from './comments.service';

@SkipThrottle()
@Controller('comments')
@UseInterceptors(SuccessInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '해당 post 댓글 조회' })
  @Get('/:postId')
  async getCommentsByPostId(@Param('postId', ParseIntPipe) post_id: number) {
    return await this.commentsService.getOneComment(post_id);
  }

  @ApiOperation({ summary: '댓글 등록' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() body: CommentRequestDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.commentsService.createComment(body, user.id);
  }

  @ApiOperation({ summary: '해당 post 댓글 수정' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CommentRequestDto,
    @GetUser() user: UserEntity,
  ) {
    console.log(id, '1111111');
    return await this.commentsService.updateComment(id, body, user);
  }

  @ApiOperation({ summary: '해당 댓글 삭제' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.deletePost(id);
  }
}
