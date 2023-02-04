import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/modules/Redis/redis.service';

@Injectable()
export class TwitchAccountBotService {
  constructor(private redisService: RedisService) {}

  async getBotInfo(
    userId: number,
    accountId: number,
  ): Promise<{
    readyState: 'OPEN';
    channels: string[];
  }> {
    const botData = await this.redisService.get(
      `twitch-bot.${userId}.${accountId}.state`,
    );
    if (!botData) throw new NotFoundException('Bot não encontrado');
    return JSON.parse(botData);
  }
}
