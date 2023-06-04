import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}

  async insertMessage() {
    return 'hi';
  }
}
