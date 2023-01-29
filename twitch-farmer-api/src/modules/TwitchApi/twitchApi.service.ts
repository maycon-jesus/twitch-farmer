import {
  PromiseDataError,
  PromiseDataSuccess,
} from './../../@types/PromiseData.d';
import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DateTime } from 'luxon';
import { PromiseData } from 'src/@types/PromiseData';
import { CustomError } from 'src/utils/PromiseError';

type RefreshTokenErrorsCodes = 'REFRESH_TOKEN_INVALID';
type ValidateTokenErrorsCodes = 'ACCESS_TOKEN_INVALID';

@Injectable()
export class TwitchApiService {
  async exchangeCodeToTokens(code: string) {
    const { data: twitchRes } = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000',
      },
    );

    return {
      accessToken: twitchRes.access_token,
      refreshToken: twitchRes.refresh_token,
    };
  }

  async validateToken(token: string) {
    const apiResponse = await axios
      .get('https://id.twitch.tv/oauth2/validate', {
        headers: {
          Authorization: 'OAuth ' + token,
        },
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.status >= 400 &&
          err.response.status <= 499
        ) {
          return new CustomError<ValidateTokenErrorsCodes>(err, {
            code: 'ACCESS_TOKEN_INVALID',
          });
        }
      });

    if (apiResponse instanceof CustomError) return apiResponse;
    const { data } = apiResponse;

    const expiresAt = DateTime.fromMillis(Date.now())
      .plus({
        seconds: data.expires_in,
      })
      .toISO();

    return {
      login: data.login,
      userId: data.user_id,
      expiresAt,
    };
  }

  async getAccountInfoById(id: string, accessToken: string) {
    const { data } = await axios.get(`https://api.twitch.tv/helix/users`, {
      params: {
        id,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
        'client-id': process.env.TWITCH_CLIENT_ID,
      },
    });

    if (!data.data.length)
      throw new HttpException('Usuário não encontrado!', 400);

    const user = data.data[0];

    return {
      id: user.id,
      email: user.email,
      login: user.login,
      displayName: user.display_name,
      avatarUrl: user.profile_image_url,
    };
  }

  async getStreamerInfo(login: string, accessToken: string) {
    const { data } = await axios.get(`https://api.twitch.tv/helix/users`, {
      params: {
        login,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
        'client-id': process.env.TWITCH_CLIENT_ID,
      },
    });

    if (!data.data.length)
      throw new HttpException('Usuário não encontrado!', 400);

    const user = data.data[0];

    return {
      id: user.id,
      login: user.login,
      displayName: user.display_name,
      avatarUrl: user.profile_image_url,
    };
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenData = await axios
      .post(`https://id.twitch.tv/oauth2/token`, {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.status >= 400 &&
          err.response.status <= 499
        ) {
          return new CustomError<RefreshTokenErrorsCodes>(err.message, {
            code: 'REFRESH_TOKEN_INVALID',
          });
        }
        throw err;
      });

    if (refreshTokenData instanceof CustomError) return refreshTokenData;

    return {
      accessToken: refreshTokenData.data.access_token,
      refreshToken: refreshTokenData.data.refresh_token,
    };
  }
}
