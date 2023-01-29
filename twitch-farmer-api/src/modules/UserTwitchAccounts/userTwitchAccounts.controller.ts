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
  UsePipes,
} from '@nestjs/common';
import { SessionData } from 'src/@types/sessionData';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserHasTwitchAccountPermissionGuard } from 'src/guards/userHasTwitchAccountPermission.guard';
import { IdsToNumberPipe } from 'src/pipes/IdsToNumber.pipe';
import { insertTwitchAccountDto } from './dto/insertTwitchAccount.dto';
import { UserTwitchAccountsService } from './userTwitchAccounts.service';

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
  @UseGuards(AuthGuard, UserHasTwitchAccountPermissionGuard)
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
  @UseGuards(AuthGuard, UserHasTwitchAccountPermissionGuard)
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

  @Get(':accountId')
  @HttpCode(200)
  @UsePipes(IdsToNumberPipe)
  @UseGuards(AuthGuard, UserHasTwitchAccountPermissionGuard)
  async getAccountDetails(
    @Param('accountId') accountId: number,
    @Param() params: any,
  ) {
    console.log(params);
    const account = await this.userTwitchAccountsService.getOne({
      id: accountId,
    });
    if (!account) throw new NotFoundException('Conta não encontrada');

    return {
      id: account.id,
      avatarUrl: account.avatarUrl,
      username: account.username,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      tokenStatus: account.tokenStatus,
    };
  }
}
