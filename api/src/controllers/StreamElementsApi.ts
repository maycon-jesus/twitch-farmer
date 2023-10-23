import { ControllerBase } from '../base/Controller';
import axios from 'axios';
import { ErrorMaker } from '../libs/ErrorMaker';

type StreamElementsItem = {
    _id: string;
    alert?: {
        graphics?: {
            src?: string
        }
    };
    allowMessages: boolean;
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
    thumbnail?: string;
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
                proxy: this.dd.webShareProxy.getRandomProxyForAxios()
            });

            const userId = userData.data._id;
            const alias = userData.data.alias;

            return {
                userId,
                alias
            };
        } catch {
            throw new ErrorMaker({
                type: 'unprocessable_entity',
                errors: [{ message: 'Usuário do streamelements inválido' }]
            });
        }
    }

    async validateToken(token: string) {
        try {
            const data = await axios.get('https://api.streamelements.com/kappa/v2/channels/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                proxy: this.dd.webShareProxy.getRandomProxyForAxios()
            });
            return { valid: true, username: data.data.username as string, id: data.data._id as string };
        } catch (err:any){
            const isUnauthorized = err.response?.status === 401
            return { valid: !isUnauthorized, username: null, id: null };
        }
    }

    async getChannelUserPoints(streamElementsChannelId: string, userTwitchLogin: string) {
        try {
            const data = await axios.get(
                `https://api.streamelements.com/kappa/v2/points/${streamElementsChannelId}/${userTwitchLogin}`,
                {
                    // proxy: this.dd.webShareProxy.getRandomProxyForAxios()
                }
            );
            return {
                points: data.data.points as number,
                rank: data.data.rank as number,
            };
        } catch {
            throw new Error('Não foi possivel obter os pontos!')
        }
    }

    async getChannelItems(streamElementsUserId: string) {
        try {
            const items = await axios.get(
                `https://api.streamelements.com/kappa/v2/store/${streamElementsUserId}/items?source=website`
            );
            return items.data as StreamElementsItem[];
        } catch {
            throw new Error('Não foi possivel carregar os items!')
        }
    }

    async getUserRedemptions(userId: string, streamElementsToken: string): Promise<{
        channel: {
            _id: string
        },
        completed: boolean,
        createdAt: string,
        input: string[],
        item?: {
            _id: string
        },
        rejected: boolean,
        updatedAt: string,
        _id: string,
        accessCode?: string
    }[]> {
        try {
            const redemptions = await axios.get<{
                docs: {
                    channel: {
                        _id: string
                    },
                    completed: boolean,
                    createdAt: string,
                    input: string[],
                    item?: {
                        _id: string
                    },
                    rejected: boolean,
                    updatedAt: string,
                    _id: string
                }[]
            }>(`https://api.streamelements.com/kappa/v2/store/${userId}/redemptions/me`, {
                params: {
                    limit: '100',
                    offset: '0',
                    order: 'createdAt'
                },
                headers: {
                    'Authorization': `Bearer ${streamElementsToken}`
                }
            });
            return redemptions.data.docs as any;
        } catch {
            return [];
        }
    }

    async redemption(channelId: string, itemId: string, input: string[], message: string | null, streamElementsToken: string): Promise<{
        accessCode?: string
    }> {
        try {
            const redemptionPayload: {
                input: string[],
                message?: string
            } = {
                input
            };

            if (message) redemptionPayload.message = message;

            const r = await axios.post<{
                accessCode?: string
            }>(`https://api.streamelements.com/kappa/v2/store/${channelId}/redemptions/${itemId}`, redemptionPayload, {
                headers: {
                    'Authorization': 'Bearer ' + streamElementsToken
                },
                proxy: this.dd.webShareProxy.getRandomProxyForAxios()
            });
            if (r.status !== 200) throw new ErrorMaker({
                type: 'unknown',
                errors: [
                    { message: 'Ocorreu um erro ao solicitar o resgate no stream elements!' }
                ]
            });
            return {
                accessCode: r.data.accessCode
            };
        } catch (e:any) {
            console.log(e)
            throw new ErrorMaker({
                type: 'unknown',
                errors: [
                    { message: 'Ocorreu um erro ao solicitar o resgate no stream elements!' }
                ]
            });
        }
    }
}
