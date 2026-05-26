import {
  IsEmail,
  IsString,
  Length,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'ConfirmPasswordMatches', async: false })
class ConfirmPasswordMatches implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, string>)[
      relatedPropertyName
    ];
    return confirmPassword === relatedValue;
  }

  defaultMessage() {
    return 'Пароли не совпадают';
  }
}

export class RegisterDto {
  @IsString()
  @Length(1, 120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 72)
  password: string;

  @IsString()
  @Length(8, 72)
  @Validate(ConfirmPasswordMatches, ['password'])
  confirmPassword: string;
}
