import axios, {AxiosRequestConfig} from 'axios';

export type WebShareProxy = {
    id: string;
    username: string;
    password: string;
    proxyAddress: string;
    port: number;
    valid: boolean;
    countryCode: string;
};

export class WebShareProxyModule {
    proxyList: WebShareProxy[] = [];

    constructor() {
        this.loadProxys().then();
    }

    async loadProxys(page = 1) {
        const proxys = await axios
            .get('https://proxy.webshare.io/api/v2/proxy/list/', {
                params: {
                    mode: 'direct',
                    page,
                    page_size: 25,
                },
                headers: {
                    Authorization: 'Token ' + process.env.WEBSHARE_PROXY_API_KEY,
                },
            })
            .catch((e) => {
                console.log(e.response)
                throw new Error('Ocorreu um erro ao carregar os proxys');
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
            setTimeout(()=>{
                this.loadProxys(page + 1).then(()=>{}).catch(()=>{});
            },1000)
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
