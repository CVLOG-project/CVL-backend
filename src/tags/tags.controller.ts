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
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiOperation } from '@nestjs/swagger';
import { TagRequestDto } from './tag.request.dto';

@SkipThrottle()
@Controller('tags')
@UseInterceptors(SuccessInterceptor)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: '전체 tag 조회' })
  @Get()
  async getAllTag() {
    const user_id = 1;

    return await this.tagsService.getAllTag(user_id);
  }

  @ApiOperation({ summary: 'tag 생성' })
  @Post()
  async createTag(@Body() body: TagRequestDto) {
    const user_id = 1;

    return await this.tagsService.createTag(user_id, body);
  }

  @ApiOperation({ summary: 'tag 수정' })
  @Put(':tag_id/:folder_id')
  async updateTag(
    @Param('tag_id', ParseIntPipe) tag_id: number,
    @Param('folder_id', ParseIntPipe) folder_id: number,
  ) {
    const user_id = 1;

    return await this.tagsService.updateTag(user_id, tag_id, folder_id);
  }
}
