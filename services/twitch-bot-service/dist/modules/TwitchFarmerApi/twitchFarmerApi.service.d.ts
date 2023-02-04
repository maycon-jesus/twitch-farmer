export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt: string;
    updateAt: string;
}
export interface TwitchAccount {
    id: number;
    username: string;
    avatarUrl: string;
    twitchUserId: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
    tokenExpiresAt: string;
    tokenStatus: 'authorized' | 'unauthorized';
}
export interface TwitchChannel {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
    twitchUserId: string;
    createdAt: string;
    updatedAt: string;
}
export declare class TwitchFarmerApiService {
    private api;
    getAllUsers(): Promise<User[]>;
    getAllTwitchAccountsByUser(userId: number): Promise<TwitchAccount[]>;
    getAllTwitchChannelsByUser(userId: number): Promise<TwitchChannel[]>;
}
