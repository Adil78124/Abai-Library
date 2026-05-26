import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(8, 72)
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @Length(8, 72)
  newPassword?: string;

  @IsOptional()
  @IsString()
  @Length(8, 72)
  confirmPassword?: string;
}
