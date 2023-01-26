import { TwitchAccountsController } from './twitchAccounts.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/auth.module';
import { TwitchApiModule } from '../TwitchApi/twitchApi.module';
import { TwitchAccountEntity } from './entities/twitchAccount.entity';
import { TwitchAccountsService } from './twitchAccounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TwitchAccountEntity]),
    TwitchApiModule,
    AuthModule,
  ],
  providers: [TwitchAccountsService],
  controllers: [TwitchAccountsController],
  exports: [TwitchAccountsService],
})
export class TwitchAccountsModule {}
