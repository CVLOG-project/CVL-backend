import { IsString } from 'class-validator';

export class TagRequestDto {
  @IsString()
  name: string;
}
