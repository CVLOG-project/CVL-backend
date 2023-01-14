import { IsOptional, IsString } from 'class-validator';

export class TagFolderRequestDto {
  @IsOptional()
  id: number;

  @IsString()
  name: string;
}
