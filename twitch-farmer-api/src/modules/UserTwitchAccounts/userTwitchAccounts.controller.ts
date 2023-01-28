import { UserTwitchAccountsService } from './userTwitchAccounts.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { insertTwitchAccountDto } from './dto/insertTwitchAccount.dto';
import { SessionData } from 'src/@types/sessionData';
import { MicroServiceGuard } from 'src/guards/microservice.guard';
import { UserHasTwitchAccountPermissionGuard } from 'src/guards/userHasTwitchAccountPermission.guard';

@Controller('users/:userId/twitch-accounts')
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

  @Delete(':accountId')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @UseGuards(UserHasTwitchAccountPermissionGuard)
  async deleteAccount(@Param('accountId') accountId: string) {
    const accountIdNumber = Number(accountId);
    if (Number.isNaN(accountIdNumber) || !Number.isInteger(accountIdNumber))
      throw new BadRequestException('Id da conta inválido');
    const account = await this.userTwitchAccountsService.getOne({
      id: accountIdNumber,
    });
    if (!account) throw new NotFoundException('Conta não encontrada');
    if (account.owner.id !== accountIdNumber)
      throw new NotFoundException('Conta não encontrada');
    await this.userTwitchAccountsService.deleteAccount(accountIdNumber);
  }
}
