import './types/express';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { RoutesModule } from './modules/Routes.module';
import { DatabaseModule } from './modules/Database.module';
import { UsersController } from './controllers/Users';
import { setDependency, setServiceDependency } from './libs/DependencysManager';
import { RolesController } from './controllers/Roles';
import { AuthController } from './controllers/Auth';
import { InviteCodesController } from './controllers/InviteCodes';
import { TwitchApiController } from './controllers/TwitchApi';
import { TwitchAccountsController } from './controllers/TwitchAccounts';
import { WebShareProxyController } from './controllers/WebShareProxy';
import { SecretsController } from './controllers/Secrets';
import { TwitchChannelsController } from './controllers/TwitchChannels';
import { StreamElementsApiController } from './controllers/StreamElementsApi';
import { TwitchRefreshTokensService } from './services/TwitchRefreshTokens';
import { TwitchBotService } from './services/TwitchBot';
import { StreamElementsPointsUpdaterService } from './services/StreamElementsPointsUpdater';
import { StreamElementsPointsController } from './controllers/StreamElementsPoints';
import { StreamElementsItemsUpdaterService } from './services/StreamElementsItemsUpdater';
import { StreamElementsItemsController } from './controllers/StreamElementsItems';
import { StreamElementsRedemptions } from './controllers/StreamElementsRedemptions';
import { StreamElementsRedemptionsUpdater } from './services/StreamElementsRedemptionsUpdater';
import { StreamElementsRedemptionsQueue } from './controllers/StreamElementsRedemptionsQueue';
import { ProxyListPingController } from './controllers/ProxyListPing';
import { ProxyPingUpdaterService } from './services/ProxyPingUpdater';
import { NtfyController } from './controllers/Ntfy';

dotenv.config({
    path: './.env',
});

const app = express();

const database = new DatabaseModule();
setDependency('database', database);

function loadControllers() {
    const usersController = new UsersController();
    setDependency('users', usersController);

    const authController = new AuthController();
    setDependency('auth', authController);

    const rolesController = new RolesController();
    setDependency('roles', rolesController);

    const inviteCodesController = new InviteCodesController();
    setDependency('inviteCodes', inviteCodesController);

    const twitchApiController = new TwitchApiController();
    setDependency('twitchApi', twitchApiController);

    const twitchAccountsController = new TwitchAccountsController();
    setDependency('twitchAccounts', twitchAccountsController);

    const webShareProxyController = new WebShareProxyController();
    setDependency('webShareProxy', webShareProxyController);

    const secretsController = new SecretsController();
    setDependency('secrets', secretsController);

    const twitchChannelsController = new TwitchChannelsController();
    setDependency('twitchChannels', twitchChannelsController);

    const streamElementsApi = new StreamElementsApiController();
    setDependency('streamElementsApi', streamElementsApi);

    const streamElementsPoints = new StreamElementsPointsController();
    setDependency('streamElementsPoints', streamElementsPoints);

    const streamElementsItems = new StreamElementsItemsController();
    setDependency('streamElementsItems', streamElementsItems);

    const streamElementsRedemptions = new StreamElementsRedemptions()
    setDependency('streamElementsRedemptions', streamElementsRedemptions)

    const streamElementsRedemptionsQueue = new StreamElementsRedemptionsQueue()
    setDependency('streamElementsRedemptionsQueue', streamElementsRedemptionsQueue)

    const proxyListPing = new ProxyListPingController()
    setDependency('proxyListPing', proxyListPing)

    const twitchRefreshTokensService = new TwitchRefreshTokensService();
    setServiceDependency('twitchRefreshToken', twitchRefreshTokensService);

    const twitchBotService = new TwitchBotService();
    setServiceDependency('twitchBot', twitchBotService);

    const ntfyController = new NtfyController()
    setDependency('ntfy', ntfyController);

    new StreamElementsPointsUpdaterService();
    new StreamElementsItemsUpdaterService();
    new StreamElementsRedemptionsUpdater()
    new ProxyPingUpdaterService()
}

database.runMigrations().then(() => {
    console.log('Migrations');
    database.runSeeds().then(() => {
        console.log('Seeds');

        loadControllers();

        const routesModule = new RoutesModule(app);
        setDependency('routes', routesModule);
    });
});

const server = http.createServer(app);
server.listen(process.env.PORT || 8080);
