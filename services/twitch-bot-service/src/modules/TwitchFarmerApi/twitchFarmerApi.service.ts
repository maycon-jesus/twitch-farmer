import { Injectable } from '@nestjs/common';
import Axios from 'axios';

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

@Injectable()
export class TwitchFarmerApiService {
  private api = Axios.create({
    baseURL: process.env.TWITCH_FARMER_API_URL,
    headers: {
      authorization: process.env.MICROSERVICE_TOKEN,
    },
  });

  async getAllUsers() {
    const allUsers = await this.api.get<User[]>('/private/users');
    return allUsers.data;
  }

  async getAllTwitchAccountsByUser(userId: number) {
    const allAccounts = await this.api.get<TwitchAccount[]>(
      `/private/users/${userId}/twitch-accounts`,
    );
    return allAccounts.data;
  }

  async getAllTwitchChannelsByUser(userId: number) {
    const allChannels = await this.api.get<TwitchChannel[]>(
      `/private/users/${userId}/twitch-channels`,
    );
    return allChannels.data;
  }
}
