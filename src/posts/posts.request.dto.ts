import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostRequestDto {
  @ApiProperty({
    example: 'It is title test',
    description: 'title',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'It is content test',
    description: 'content',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 1,
    description: 'category_id',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({
    example: true,
    description: 'public_status',
    required: true,
  })
  public_status: boolean;

  @IsArray()
  tags: string[];
}
