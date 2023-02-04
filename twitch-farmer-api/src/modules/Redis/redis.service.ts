import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      password: process.env.REDIS_PASSWORD,
    });
    this.client.connect();
  }

  async set(key: string, value: any, expires?: number) {
    await this.client.set(key, value);
    if (expires) {
      await this.client.expire(key, expires);
    }
  }

  async get(key: string) {
    return await this.client.get(key);
  }
}
