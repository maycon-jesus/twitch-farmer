import { IsNotEmpty, IsString, Length } from 'class-validator';

export class loginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
