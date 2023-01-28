import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/auth.module';
import { UserTwitchAccountEntity } from '../UserTwitchAccounts/entities/userTwitchAccount.entity';
import { AuthGuardService } from './authGuard.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserTwitchAccountEntity])],
  providers: [AuthGuardService],
  exports: [AuthGuardService],
})
export class AuthGuardModule {}
