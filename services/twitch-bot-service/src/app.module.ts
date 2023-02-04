import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TwitchBotQueueModule } from './queues/twitchBotQueue/twitchBotQueue.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    TwitchBotQueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
