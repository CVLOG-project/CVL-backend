import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { DataSource, Repository } from 'typeorm';
import { MessageRequestDto } from './messages.request.dto';
import * as moment from 'moment';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}

  async createMessage(body: MessageRequestDto) {
    const { receiver_id, sender_id, content } = body;

    const message = this.messagesRepository.create({
      receiver_id,
      sender_id,
      contents: content,
    });

    message.created_at = moment().format('YYYY-MM-DD hh:mm:ss');

    const result = await this.messagesRepository.save(message);

    return result;
  }
}
