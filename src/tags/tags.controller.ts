import { UserEntity } from 'src/entities/users.entity';
import { SkipThrottle } from '@nestjs/throttler';
import { TagsService } from './tags.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiOperation } from '@nestjs/swagger';
import { TagRequestDto } from './tag.request.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/auth.decorator';

@SkipThrottle()
@Controller('tags')
@UseInterceptors(SuccessInterceptor)
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: '전체 tag 조회' })
  @Get()
  async getAllTag(@GetUser() user: UserEntity) {
    return await this.tagsService.getAllTag(user);
  }

  @ApiOperation({ summary: 'tag 생성' })
  @Post()
  async createTag(@Body() body: TagRequestDto, @GetUser() user: UserEntity) {
    return await this.tagsService.createTag(user, body);
  }

  @ApiOperation({ summary: 'tag 수정' })
  @Put(':tag_id/:folder_id')
  async updateTag(
    @Param('tag_id', ParseIntPipe) tag_id: number,
    @Param('folder_id', ParseIntPipe) folder_id: number,
    @GetUser() user: UserEntity,
  ) {
    return await this.tagsService.updateTag(user, tag_id, folder_id);
  }
}
