import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { MicroServiceGuard } from 'src/guards/microservice.guard';
import { IdsToNumberPipe } from 'src/pipes/IdsToNumber.pipe';
import { UserTwitchAccountsService } from '../UserTwitchAccounts/userTwitchAccounts.service';

@Controller('/private/users/:userId/twitch-accounts')
@UsePipes(IdsToNumberPipe)
@UseGuards(MicroServiceGuard)
export class UserTwitchAccountsPrivateController {
  constructor(private userTwitchAccounts: UserTwitchAccountsService) {}

  @Get()
  async getAllTwitchAccounts(@Param('userId') userId: number) {
    const allAccounts = await this.userTwitchAccounts.getAll({
      where: {
        owner: {
          id: userId,
        },
      },
      loadEagerRelations: false,
    });

    return allAccounts;
  }
}
