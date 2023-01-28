import { UserTwitchAccountsController } from './userTwitchAccounts.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/auth.module';
import { TwitchApiModule } from '../TwitchApi/twitchApi.module';
import { UserTwitchAccountEntity } from './entities/userTwitchAccount.entity';
import { UserTwitchAccountsService } from './userTwitchAccounts.service';
import { AuthGuardModule } from '../AuthGuard/authGuard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTwitchAccountEntity]),
    TwitchApiModule,
    AuthModule,
    AuthGuardModule,
  ],
  providers: [UserTwitchAccountsService],
  controllers: [UserTwitchAccountsController],
  exports: [UserTwitchAccountsService],
})
export class UserTwitchAccountsModule {}
