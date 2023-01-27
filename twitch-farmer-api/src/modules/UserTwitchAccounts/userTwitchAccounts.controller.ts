import { UserTwitchAccountsService } from './userTwitchAccounts.service';
import {
  Body,
  Controller,
  Get,
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

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async listMyAccounts(@Session() session: SessionData) {
    const accounts = await this.userTwitchAccountsService.getAllByUser(
      session.sub,
    );
    const accountsMap = accounts.map(
      ({ id, avatarUrl, createdAt, updatedAt, username }) => {
        return {
          id,
          avatarUrl,
          createdAt,
          updatedAt,
          username,
        };
      },
    );
    return {
      data: accountsMap,
    };
  }
}
