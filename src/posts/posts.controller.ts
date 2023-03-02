import { UserEntity } from 'src/entities/users.entity';
import { AwsService } from './aws.service';
import { PostRequestDto } from './posts.request.dto';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseInterceptors,
  Body,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { SuccessInterceptor } from './../common/interceptors/success.interceptor';
import { PostsService } from './posts.service';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { GetUser } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('posts')
@UseInterceptors(SuccessInterceptor)
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation({ summary: '전체 post 조회' })
  @SkipThrottle()
  @Get('/page/:page')
  async getAllPost(
    @GetUser() user: UserEntity,
    @Param('page', ParseIntPipe) page: number,
  ) {
    return await this.postsService.getAllPost(user, page);
  }

  @ApiOperation({ summary: 'post 상세 조회' })
  @SkipThrottle()
  @Get(':id')
  async getOnePost(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.postsService.getOnePost(user, id);
  }

  @ApiOperation({ summary: 'post 등록' })
  @Throttle(2, 60)
  @Post()
  async createPost(@Body() body: PostRequestDto, @GetUser() user: UserEntity) {
    return await this.postsService.createPost(body, user);
  }

  @ApiOperation({ summary: 'post 수정' })
  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PostRequestDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.postsService.updatePost(id, body, user);
  }

  @ApiOperation({ summary: 'post partial 수정' })
  @SkipThrottle()
  @Patch(':id')
  async updatePartialPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('public_status') public_status: boolean,
  ) {
    return this.postsService.updatePartialPost(id, public_status);
  }

  @ApiOperation({ summary: 'post 삭제' })
  @SkipThrottle()
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.deletePost(id);
  }

  @ApiOperation({ summary: 'post 이미지 업로드' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.awsService.uploadFileToS3('posts', file);

    const url = this.awsService.getAwsS3FileUrl(result.key);

    const dataInDB = await this.postsService.uploadFile(result.key);

    return {
      id: dataInDB.id,
      name: file.originalname,
      url: url,
    };
  }
}
