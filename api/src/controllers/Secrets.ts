import { ControllerBase } from '../base/Controller';
import axios from 'axios';
import { DateTime } from 'luxon';

export class SecretsController extends ControllerBase {
    async getTwitchToken(): Promise<string> {
        const twitchToken: {
            name: string,
            value: string,
            expiresAt: Date | null
        } | null = await this.dd.database.db('secrets').where({ name: 'TWITCH_TOKEN' }).first();

        if (!twitchToken) {
            const data = await axios.post('https://id.twitch.tv/oauth2/token', {
                client_id: process.env.TWITCH_BOT_CLIENT_ID,
                client_secret: process.env.TWITCH_BOT_CLIENT_SECRET,
                grant_type: 'client_credentials'
            });
            await this.dd.database.db('secrets').insert({
                name: 'TWITCH_TOKEN',
                value: data.data.access_token,
                expiresAt: DateTime.now().plus({
                    second: data.data.expires_in
                }).toISO()
            });
            return data.data.access_token;
        }

        const expired = twitchToken.expiresAt ? (DateTime.fromJSDate(twitchToken.expiresAt).diffNow().get('second') < 0) : false;
        console.log('Teste espirado', twitchToken.expiresAt? DateTime.fromJSDate(twitchToken.expiresAt).diffNow().get('second'):false)
        if (expired) {
            const data = await axios.post('https://id.twitch.tv/oauth2/token', {
                client_id: process.env.TWITCH_BOT_CLIENT_ID,
                client_secret: process.env.TWITCH_BOT_CLIENT_SECRET,
                grant_type: 'client_credentials'
            });
            await this.dd.database.db('secrets').update({
                value: data.data.access_token,
                expiresAt: DateTime.now().plus({
                    second: data.data.expires_in
                }).toISO()
            }).where({ name: 'TWITCH_TOKEN' });
            return data.data.access_token;
        }

        return twitchToken.value;
    }
}