import { Module } from '@nestjs/common';
import { UsersModule } from '../Users/users.module';
import { UserTwitchAccountsModule } from '../UserTwitchAccounts/userTwitchAccounts.module';
import { UserTwitchChannelsModule } from '../UserTwitchChannels/userTwitchChannels.module';
import { UsersPrivateController } from './users';
import { UserTwitchAccountsPrivateController } from './userTwitchAccounts';
import { UserTwitchChannelsPrivateController } from './userTwitchChannels';

@Module({
  imports: [UsersModule, UserTwitchAccountsModule, UserTwitchChannelsModule],
  controllers: [
    UsersPrivateController,
    UserTwitchAccountsPrivateController,
    UserTwitchChannelsPrivateController,
  ],
})
export class PrivateModule {}
