import { ControllerBase } from '../base/Controller';
import axios from 'axios';
import { ErrorMaker } from '../libs/ErrorMaker';
import { DateTime } from 'luxon';

export class TwitchApiController extends ControllerBase {
    async getAccountDetails(
        id: string,
        auth: { accessToken: string }
    ): Promise<{
        id: string;
        login: string;
        displayName: string;
        profileImageUrl: string;
        email: string;
    }> {
        const users = await axios
            .get(`https://api.twitch.tv/helix/users`, {
                params: {
                    id,
                },
                headers: {
                    Authorization: 'Bearer ' + auth.accessToken,
                    'Client-Id': process.env.TWITCH_BOT_CLIENT_ID,
                },
                proxy: this.dd.webShareProxy.getRandomProxyForAxios(),
            })
            .catch((err) => {
                console.log(err);
                throw new ErrorMaker({
                    type: 'other',
                    errors: [{ message: 'Não encontramos seu usuário no banco de dados da twitch' }],
                });
            });
        const user = users.data.data[0];

        return {
            id: user.id,
            login: user.login,
            displayName: user.display_name,
            profileImageUrl: user.profile_image_url,
            email: user.email
        };
    }

    async getAccountDetailsByLogin(
        login: string
    ): Promise<{
        id: string;
        login: string;
        displayName: string;
        profileImageUrl: string;
    }> {
        const accessToken = await this.dd.secrets.getTwitchToken();
        const users = await axios
            .get(`https://api.twitch.tv/helix/users`, {
                params: {
                    login: login
                },
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Client-Id': process.env.TWITCH_BOT_CLIENT_ID
                },
                proxy: this.dd.webShareProxy.getRandomProxyForAxios()
            })
            .catch((err) => {
                console.log(err);
                throw new ErrorMaker({
                    type: 'other',
                    errors: [{ message: 'Não encontramos este usuário no banco de dados da twitch' }]
                });
            });
        if (users.data.data.length <= 0) throw new ErrorMaker({
            type: 'other',
            errors: [{ message: 'Não encontramos este usuário no banco de dados da twitch' }]
        });
        const user = users.data.data[0];

        return {
            id: user.id,
            login: user.login,
            displayName: user.display_name,
            profileImageUrl: user.profile_image_url
        };
    }

    async validateToken(accessToken: string): Promise<{
        login: string;
        userId: string;
    }> {
        const tokenData = await axios
            .get(`https://id.twitch.tv/oauth2/validate`, {
                headers: {
                    Authorization: 'OAuth ' + accessToken
                },
                proxy: this.dd.webShareProxy.getRandomProxyForAxios(),
            })
            .catch(() => {
                throw new ErrorMaker({
                    type: 'other',
                    errors: [{ message: 'O token de acesso gerado é invalido. Tente novamente!' }],
                });
            });

        return {
            login: tokenData.data.login,
            userId: tokenData.data.user_id,
        };
    }

    async codeToToken(
        code: string,
        redirectUrl: string
    ): Promise<{
        accessToken: string;
        expiresIn: DateTime;
        refreshToken: string;
    }> {
        const data = await axios
            .post(
                `https://id.twitch.tv/oauth2/token`,
                {
                    client_id: process.env.TWITCH_BOT_CLIENT_ID,
                    client_secret: process.env.TWITCH_BOT_CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUrl,
                },
                {
                    proxy: this.dd.webShareProxy.getRandomProxyForAxios(),
                }
            )
            .catch((err) => {
                throw new ErrorMaker({
                    type: 'other',
                    errors: [{ message: 'Ocorreu um erro na geração dos códigos de acesso da sua conta' }],
                });
            });

        const expiresAt = DateTime.now().plus({
            seconds: data.data.expires_in,
        });

        return {
            accessToken: data.data.access_token,
            expiresIn: expiresAt,
            refreshToken: data.data.refresh_token,
        };
    }
}
