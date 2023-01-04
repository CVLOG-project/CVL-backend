import { PostRequestDto } from './posts.request.dto';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  HttpException,
  UseInterceptors,
  Body,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { SuccessInterceptor } from './../common/interceptors/success.interceptor';
import { PostsService } from './posts.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('posts')
@UseInterceptors(SuccessInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '전체 post 조회' })
  @Get()
  getAllPost() {
    return this.postsService.getAllPost();
  }

  @ApiOperation({ summary: 'post 상세 조회' })
  @Get(':id')
  getOnePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getOnePost(id);
  }

  @ApiOperation({ summary: 'post 등록' })
  @Post()
  createPost(@Body() body: PostRequestDto) {
    return this.postsService.createPost(body);
  }

  @ApiOperation({ summary: 'post 수정' })
  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PostRequestDto,
  ) {
    return await this.postsService.updatePost(id, body);
  }

  @ApiOperation({ summary: 'post partial 수정' })
  @Patch(':id')
  async updatePartialPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('public_status') public_status: boolean,
  ) {
    return this.postsService.updatePartialPost(id, public_status);
  }

  @ApiOperation({ summary: 'post 삭제' })
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
