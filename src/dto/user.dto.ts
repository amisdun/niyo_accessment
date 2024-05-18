import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@app/decorator';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignUpDto {
  @ApiProperty({ required: true, description: 'User first name' })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ required: false, description: 'User other names' })
  @IsOptional()
  @IsString()
  readonly otherNames?: string;

  @ApiProperty({ required: true, description: 'User last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: true, description: 'User email' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @ApiProperty({ required: true, description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password too weak, It should contain at least, 1 Uppercase, 1 Numeric, 1 Lowercase, 1 special characters',
  })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Match('password', { message: 'password does not match' })
  confirmPassword: string;
}

export class AuthResponseDto {
  @ApiProperty({
    type: String,
    description: 'Jwt token',
  })
  token: string;
}
