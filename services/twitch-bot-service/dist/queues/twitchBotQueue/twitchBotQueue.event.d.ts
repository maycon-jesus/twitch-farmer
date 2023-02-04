import type { Queue } from 'bullmq';
import { TwitchAccount, TwitchChannel, User } from 'src/modules/TwitchFarmerApi/twitchFarmerApi.service';
export interface JobLoadData {
    user: User;
}
export interface JobInitBotData extends JobLoadData {
    twitchChannels: TwitchChannel[];
    twitchAccounts: TwitchAccount[];
}
export interface JobLoadBotState {
    user: User;
    twitchAccount: TwitchAccount;
}
export declare class TwitchBotQueueEvent {
    private twitchBotQueue;
    constructor(twitchBotQueue: Queue);
    pushJobToLoadData(data: JobLoadData): void;
    pushJobToInitBot(data: JobInitBotData): void;
    pushJobLoadBotState(data: JobLoadBotState): Promise<void>;
}
