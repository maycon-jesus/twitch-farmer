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
}

const dependencys: {
    [dependencyName: string]: any;
} = {};

export function setDependency<K extends keyof IDependencys>(dependencyName: K, value: IDependencys[K]) {
    dependencys[dependencyName] = value;
}

export function getDependencys(): any {
    return dependencys;
}