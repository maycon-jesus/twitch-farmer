import { RouteBase } from '../../base/Route';
import { AuthLoginRoute } from './login';
import { AuthRegisterRoute } from './register';

export class AuthRoutes extends RouteBase {
    constructor() {
        super({
            path: '/auth',
            childs: [new AuthRegisterRoute(), new AuthLoginRoute()],
        });
    }

    run(): void {
        this.router.get('/', (req, res) => {
            res.json({ teste: true });
        });
    }
}
