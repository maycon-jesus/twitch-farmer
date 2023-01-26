import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 255)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(0, 255)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
