import {ControllerBase} from '../base/Controller';
import axios, {AxiosRequestConfig} from 'axios';
import {ErrorMaker} from '../libs/ErrorMaker';

export type WebShareProxy = {
    id: string;
    username: string;
    password: string;
    proxyAddress: string;
    port: number;
    valid: boolean;
    countryCode: string;
};

export class WebShareProxyController extends ControllerBase {
    proxyList: WebShareProxy[] = [];

    constructor() {
        super();
        this.loadProxys().then();
    }

    async loadProxys(page = 1) {
        const proxys = await axios
            .get('https://proxy.webshare.io/api/v2/proxy/list/', {
                params: {
                    mode: 'direct',
                    page,
                    page_size: 2,
                },
                headers: {
                    Authorization: 'Token ' + process.env.WEBSHARE_PROXY_API_KEY,
                },
            })
            .catch(() => {
                throw new ErrorMaker({
                    type: 'other',
                    errors: [{message: 'Ocorreu um erro ao carregar os proxys'}],
                });
            });
        this.proxyList.push(
            ...proxys.data.results.map((proxy: any) => {
                return {
                    id: proxy.id,
                    username: proxy.username,
                    password: proxy.password,
                    proxyAddress: proxy.proxy_address,
                    port: proxy.port,
                    valid: proxy.valid,
                    countryCode: proxy.country_code,
                };
            })
        );

        if (proxys.data.next) {
            await this.loadProxys(page + 1);
        }
    }

    getRandomProxyForAxios(): AxiosRequestConfig['proxy'] {
        const proxy = this.proxyList[Math.floor(Math.random() * this.proxyList.length)];
        return {
            host: proxy.proxyAddress,
            port: proxy.port,
            auth: {
                username: proxy.username,
                password: proxy.password,
            },
            protocol: 'http',
        };
    }
}
