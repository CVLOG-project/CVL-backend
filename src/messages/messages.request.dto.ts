import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

export class MessageInsertDto {
  @IsNumber()
  receiver_id: number;

  @IsNumber()
  sender_id: number;

  @IsString()
  content: string;
}

export class MessageRequestDto {
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : parseInt(value)))
  @IsNumber()
  @Min(1)
  receiver_id: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : parseInt(value)))
  @IsNumber()
  @Min(1)
  sender_id: number;
}

export class MessageReceiverDeleteDto {
  @IsNumber()
  id: number;

  @IsNumber()
  reciever_id: number;

  @IsBoolean()
  receiver_delete_yn: true | false;
}

export class MessageSenderDeleteDto {
  @IsNumber()
  id: number;

  @IsNumber()
  sender_id: number;

  @IsBoolean()
  sender_delete_yn: true | false;
}

export class MessageCheckTimeDto {
  @IsNumber()
  id: number;
}

export class MessageResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  receiver_id: number;

  @IsNumber()
  sender_id: number;

  @IsBoolean()
  receiver_delete_yn: true | false;

  @IsBoolean()
  sender_delete_yn: true | false;

  @IsDate()
  created_at: string;

  @IsString()
  contents: string;

  @IsString()
  opened_at?: string;

  @IsString()
  receiver_delete_at?: string;

  @IsString()
  sender_delete_at?: string;
}
