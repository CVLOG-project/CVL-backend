import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { MessagesService } from './messages.service';
import { ApiOperation } from '@nestjs/swagger';
import { MessageInsertDto, MessageRequestDto } from './messages.request.dto';

@SkipThrottle()
@Controller('messages')
@UseInterceptors(SuccessInterceptor)
// @UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: '메시지 DB insert' })
  @Post()
  async createMessage(@Body() body: MessageInsertDto) {
    return await this.messagesService.createMessage(body);
  }

  @Get()
  async getMessages(@Query() query: MessageRequestDto) {
    if (!('receiver_id' in query)) {
      throw new BadRequestException(`Not exist receiver_id`);
    }
    if (!('sender_id' in query)) {
      throw new BadRequestException(`Not exist sender_id`);
    }
    return await this.messagesService.getMessages(query);
  }
}
