import { UserTwitchAccountEntity } from './../UserTwitchAccounts/entities/userTwitchAccount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuardService {
  constructor(
    @InjectRepository(UserTwitchAccountEntity)
    private usertwitchAccountRepository: Repository<UserTwitchAccountEntity>,
  ) {}

  async userHasPermissionInTwitchAccount(
    userId: number,
    twitchAccountId: number,
  ) {
    const account = await this.usertwitchAccountRepository.findOne({
      where: {
        id: twitchAccountId,
      },
    });
    if (!account) throw new NotFoundException('Conta não encontrada');
    if (account.owner.id !== userId)
      throw new ForbiddenException('Você não possui permissão para isso');
    return true;
  }
}
