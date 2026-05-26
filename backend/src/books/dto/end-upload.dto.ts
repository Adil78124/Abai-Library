import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class EndUploadDto {
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  error?: string;
}
