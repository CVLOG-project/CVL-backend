import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async getAllTag(user_id) {
    return this.tagsRepository.getAllTag(user_id);
  }
}
