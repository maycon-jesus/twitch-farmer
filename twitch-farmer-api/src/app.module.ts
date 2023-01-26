import { TwitchApiQueueModule } from './queues/TwitchApiQueue/twitchApiQueue.module';
import { UsersModule } from './modules/Users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';
import { TwitchAccountsModule } from './modules/TwitchAccounts/twitchAccounts.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    UsersModule,
    AuthModule,
    TwitchAccountsModule,
    TwitchApiQueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
