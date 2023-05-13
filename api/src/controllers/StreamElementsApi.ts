import { ControllerBase } from '../base/Controller';
import axios from 'axios';
import { ErrorMaker } from '../libs/ErrorMaker';

type StreamElementsItem = {
    _id: string;
    categoryName: string;
    channel: string;
    cooldown: {
        user: number;
        category: number;
        global: number;
    };
    cost: number;
    createdAt: string;
    description: string;
    enabled: boolean;
    subscriberOnly: boolean;
    name: string;
    quantity: {
        total: number;
        current: number;
    };
    thumbnail: string;
    updatedAt: string;
    userInput: string[];
};

export class StreamElementsApiController extends ControllerBase {
    async getChannel(channelAlias: string): Promise<{
        userId: string;
        alias: string;
    }> {
        try {
            const userData = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${channelAlias}`, {
                proxy: this.dd.webShareProxy.getRandomProxyForAxios(),
            });

            const userId = userData.data._id;
            const alias = userData.data.alias;

            return {
                userId,
                alias,
            };
        } catch {
            throw new ErrorMaker({
                type: 'unprocessable_entity',
                errors: [{ message: 'Usuário do streamelements inválido' }],
            });
        }
    }

    async validateToken(token: string) {
        try {
            const data = await axios.get('https://api.streamelements.com/kappa/v2/channels/me', {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            return { valid: true, username: data.data.username as string };
        } catch {
            return { valid: false };
        }
    }

    async getChannelUserPoints(streamElementsChannelId: string, userTwitchLogin: string) {
        try {
            const data = await axios.get(
                `https://api.streamelements.com/kappa/v2/points/${streamElementsChannelId}/${userTwitchLogin}`,
                {
                    proxy: this.dd.webShareProxy.getRandomProxyForAxios(),
                }
            );
            return {
                points: data.data.points as number,
            };
        } catch {
            return {
                points: 0,
            };
        }
    }

    async getChannelItems(streamElementsUserId: string) {
        try {
            const items = await axios.get(
                `https://api.streamelements.com/kappa/v2/store/${streamElementsUserId}/items?source=website`
            );
            return items.data as StreamElementsItem[];
        } catch {
            return [];
        }
    }
}
