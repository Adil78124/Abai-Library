import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class BookChatDto {
  @IsString()
  @Length(1, 2000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  sessionId?: string;
}
