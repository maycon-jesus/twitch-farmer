import { RedisClientType } from 'redis';
export declare class RedisService {
    client: RedisClientType;
    constructor();
    set(key: string, value: any, expires?: number): Promise<void>;
    get(key: string): Promise<string>;
}
