import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { MessageRequestDto } from './messages.request.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async createMessage(body: MessageRequestDto) {
    return await this.messagesRepository.createMessage(body);
  }
}
