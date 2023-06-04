import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { MessagesService } from './messages.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetQuery } from 'src/common/decorators/getquery.decorator';

@SkipThrottle()
@Controller('messages')
@UseInterceptors(SuccessInterceptor)
// @UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: '메시지 DB insert' })
  @Post()
  async createMessage(@GetQuery() query: any) {
    console.log(query);
    return await this.messagesService.createMessage();
  }
}
