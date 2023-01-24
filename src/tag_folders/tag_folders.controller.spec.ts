import { Test, TestingModule } from '@nestjs/testing';
import { TagFoldersController } from './tag_folders.controller';

describe('TagFoldersController', () => {
  let controller: TagFoldersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagFoldersController],
    }).compile();

    controller = module.get<TagFoldersController>(TagFoldersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
