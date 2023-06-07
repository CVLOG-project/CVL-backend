import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class MessageRequestDto {
  @IsNumber()
  receiver_id: number;

  @IsNumber()
  sender_id: number;

  @IsString()
  content: string;
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
