import { IsNotEmpty, IsString } from 'class-validator';

export class insertTwitchAccountDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
