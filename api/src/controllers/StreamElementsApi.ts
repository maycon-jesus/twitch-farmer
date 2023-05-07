import { ControllerBase } from '../base/Controller';
import axios from 'axios';
import { ErrorMaker } from '../libs/ErrorMaker';

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
}
