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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TagFoldersService } from './tag_folders.service';
import { ApiOperation } from '@nestjs/swagger';
import { TagFolderRequestDto } from './tag_folder.request.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/auth.decorator';
import { UserEntity } from 'src/entities/users.entity';

@SkipThrottle()
@Controller('tag_folders')
@UseInterceptors(SuccessInterceptor)
@UseGuards(JwtAuthGuard)
export class TagFoldersController {
  constructor(private readonly tagFoldersService: TagFoldersService) {}

  @ApiOperation({ summary: 'tag folder 전체 조회' })
  @Get()
  async getAllFolder(@GetUser() user: UserEntity) {
    return await this.tagFoldersService.getAllFolder(user);
  }

  @ApiOperation({ summary: 'tag folder 등록' })
  @Post()
  async createFolder(
    @Body() body: TagFolderRequestDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.tagFoldersService.createFolder(body, user);
  }

  @ApiOperation({ summary: 'tag folder 이름 수정' })
  @Put(':id')
  async updateFolder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TagFolderRequestDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.tagFoldersService.updateFolder(id, body, user);
  }

  @ApiOperation({ summary: 'tag folder 삭제' })
  @Delete(':id')
  async deleteFolder(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ) {
    return await this.tagFoldersService.deleteFolder(id, user);
  }
}
