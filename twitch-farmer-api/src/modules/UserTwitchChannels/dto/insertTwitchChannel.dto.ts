import { IsNotEmpty, IsString, Length } from 'class-validator';

export class insertTwitchChannelDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  username: string;
}
