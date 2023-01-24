import { TagsService } from './tags.service';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiOperation } from '@nestjs/swagger';
import { TagRequestDto } from './tag.request.dto';

@Controller('tags')
@UseInterceptors(SuccessInterceptor)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: '전체 tag 조회' })
  @Get()
  getAllTag() {
    const user_id = 1;

    return this.tagsService.getAllTag(user_id);
  }

  @ApiOperation({ summary: 'tag 생성' })
  @Post()
  createTag(@Body() body: TagRequestDto) {
    const user_id = 1;

    return this.tagsService.createTag(user_id, body);
  }
}
