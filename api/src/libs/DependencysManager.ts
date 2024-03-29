import { AuthController } from '../controllers/Auth';
import { InviteCodesController } from '../controllers/InviteCodes';
import { RolesController } from '../controllers/Roles';
import { TwitchAccountsController } from '../controllers/TwitchAccounts';
import { TwitchApiController } from '../controllers/TwitchApi';
import { UsersController } from '../controllers/Users';
import { WebShareProxyController } from '../controllers/WebShareProxy';
import { DatabaseModule } from '../modules/Database.module';
import { RoutesModule } from '../modules/Routes.module';
import { SecretsController } from '../controllers/Secrets';
import { TwitchChannelsController } from '../controllers/TwitchChannels';
import { StreamElementsApiController } from '../controllers/StreamElementsApi';
import { TwitchRefreshTokensService } from '../services/TwitchRefreshTokens';
import { TwitchBotService } from '../services/TwitchBot';
import { StreamElementsPointsController } from '../controllers/StreamElementsPoints';
import { StreamElementsItemsController } from '../controllers/StreamElementsItems';
import { StreamElementsRedemptions } from '../controllers/StreamElementsRedemptions';
import { StreamElementsRedemptionsQueue } from '../controllers/StreamElementsRedemptionsQueue';
import { ProxyListPingController } from '../controllers/ProxyListPing';
import { TwitchUsersController } from '../controllers/TwitchUsers';
import { TwitchWhispersController } from '../controllers/TwitchWhispers';
import { NotificationsController } from '../controllers/Notifications';

export interface IDependencys {
    database: DatabaseModule;
    routes: RoutesModule;
    users: UsersController;
    roles: RolesController;
    auth: AuthController;
    inviteCodes: InviteCodesController;
    twitchApi: TwitchApiController;
    twitchAccounts: TwitchAccountsController;
    webShareProxy: WebShareProxyController;
    secrets: SecretsController;
    twitchChannels: TwitchChannelsController;
    streamElementsApi: StreamElementsApiController;
    streamElementsPoints: StreamElementsPointsController;
    streamElementsItems: StreamElementsItemsController;
    streamElementsRedemptions: StreamElementsRedemptions
    streamElementsRedemptionsQueue: StreamElementsRedemptionsQueue
    proxyListPing: ProxyListPingController,
    notifications: NotificationsController,
    twitchUsers: TwitchUsersController
    twitchWhispers: TwitchWhispersController
    services: {
        twitchRefreshToken: TwitchRefreshTokensService;
        twitchBot: TwitchBotService;
    };
}

const dependencys: {
    [dependencyName: string]: any;
    services: {
        [dependencyName: string]: any;
    };
} = {
    services: {},
};

export function setDependency<K extends keyof IDependencys>(dependencyName: K, value: IDependencys[K]) {
    dependencys[dependencyName] = value;
}

export function setServiceDependency<K extends keyof IDependencys['services']>(
    dependencyName: K,
    value: IDependencys['services'][K]
) {
    dependencys.services[dependencyName] = value;
}

export function getDependencys(): any {
    return dependencys;
}
