import './types/express';
import express from 'express';
import http from 'http';
import { RoutesModule } from './modules/Routes.module';
import { DatabaseModule } from './modules/Database.module';
import { UsersController } from './controllers/Users';
import { setDependency } from './libs/DependencysManager';
import { RolesController } from './controllers/Roles';
import { AuthController } from './controllers/Auth';
import { InviteCodesController } from './controllers/InviteCodes';

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
