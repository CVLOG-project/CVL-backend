import { IsNumber, IsString } from 'class-validator';

export class CommentRequestDto {
  @IsString()
  content: string;
}
