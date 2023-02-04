import { CustomError } from 'src/utils/CustomError';
import * as tmi from 'tmi.js';
import { TwitchAccount, TwitchChannel, User } from '../TwitchFarmerApi/twitchFarmerApi.service';
interface InitBotData {
    user: User;
    twitchChannels: TwitchChannel[];
    twitchAccount: TwitchAccount;
}
interface TwitchBot {
    client: tmi.Client;
    user: User;
    twitchAccount: TwitchAccount;
    twitchChannels: TwitchChannel[];
}
export declare class TwitchBotService {
    private bots;
    private botExists;
    insertBot(twitchBot: TwitchBot): Promise<void>;
    initBot(initBotData: InitBotData): Promise<void>;
    getBotState(userId: number, accountId: number): Promise<CustomError<"BOT_NOT_FOUND"> | {
        readyState: "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";
        channels: string[];
    }>;
}
export {};
