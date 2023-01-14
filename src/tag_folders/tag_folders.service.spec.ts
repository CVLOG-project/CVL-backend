import { Test, TestingModule } from '@nestjs/testing';
import { TagFoldersService } from './tag_folders.service';

describe('TagFoldersService', () => {
  let service: TagFoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagFoldersService],
    }).compile();

    service = module.get<TagFoldersService>(TagFoldersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
