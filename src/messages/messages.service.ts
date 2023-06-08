import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { MessageInsertDto, MessageRequestDto } from './messages.request.dto';
import _ from 'lodash';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async createMessage(body: MessageInsertDto) {
    return await this.messagesRepository.createMessage(body);
  }

  async getMessages(query: MessageRequestDto) {
    // 값이 없는 key값을 지워버려야 한다.
    _.forEach(query, (item) => console.log(item));

    return await this.messagesRepository.getMessages(query);
  }
}
