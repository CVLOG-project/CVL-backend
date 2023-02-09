import { SkipThrottle } from '@nestjs/throttler';
import { SuccessInterceptor } from './../common/interceptors/success.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { TagFoldersService } from './tag_folders.service';
import { ApiOperation } from '@nestjs/swagger';
import { TagFolderRequestDto } from './tag_folder.request.dto';

@SkipThrottle()
@Controller('tag_folders')
@UseInterceptors(SuccessInterceptor)
export class TagFoldersController {
  constructor(private readonly tagFoldersService: TagFoldersService) {}

  @ApiOperation({ summary: 'tag folder 전체 조회' })
  @Get()
  async getAllFolder() {
    return await this.tagFoldersService.getAllFolder();
  }

  @ApiOperation({ summary: 'tag folder 등록' })
  @Post()
  async createFolder(@Body() body: TagFolderRequestDto) {
    return await this.tagFoldersService.createFolder(body);
  }

  @ApiOperation({ summary: 'tag folder 이름 수정' })
  @Put(':id')
  async updateFolder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TagFolderRequestDto,
  ) {
    return await this.tagFoldersService.updateFolder(id, body);
  }

  @ApiOperation({ summary: 'tag folder 삭제' })
  @Delete(':id')
  async deleteFolder(@Param('id', ParseIntPipe) id: number) {
    return await this.tagFoldersService.deleteFolder(id);
  }
}
