import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/auth.module';
import { AuthGuardModule } from '../AuthGuard/authGuard.module';
import { TwitchApiModule } from '../TwitchApi/twitchApi.module';
import { UserTwitchAccountEntity } from './entities/userTwitchAccount.entity';
import { TwitchAccountBotModule } from './modules/TwitchAccountBot/twitchAccountBot.module';
import { UserTwitchAccountsController } from './userTwitchAccounts.controller';
import { UserTwitchAccountsService } from './userTwitchAccounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTwitchAccountEntity]),
    TwitchApiModule,
    AuthModule,
    AuthGuardModule,
    TwitchAccountBotModule,
  ],
  providers: [UserTwitchAccountsService],
  controllers: [UserTwitchAccountsController],
  exports: [UserTwitchAccountsService],
})
export class UserTwitchAccountsModule {}
