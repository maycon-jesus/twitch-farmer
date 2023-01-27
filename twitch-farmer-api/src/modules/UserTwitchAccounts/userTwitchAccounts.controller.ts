import { UserTwitchAccountsService } from './userTwitchAccounts.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { insertTwitchAccountDto } from './dto/insertTwitchAccount.dto';
import { SessionData } from 'src/@types/sessionData';

@Controller('twitch-accounts')
export class UserTwitchAccountsController {
  constructor(private userTwitchAccountsService: UserTwitchAccountsService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async insert(
    @Session() session: SessionData,
    @Body() body: insertTwitchAccountDto,
  ) {
    const data = await this.userTwitchAccountsService.insert({
      code: body.code,
      owner: session.sub,
    });
    return {
      id: data.id,
    };
  }
}
