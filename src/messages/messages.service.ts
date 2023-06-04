import { Injectable } from '@nestjs/common';
import { SendMessagesResponse } from 'aws-sdk/clients/pinpoint';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async createMessage() {
    return await this.messagesRepository.insertMessage();
  }
}
