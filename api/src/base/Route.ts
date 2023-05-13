import express from 'express';
import { getDependencys, IDependencys } from '../libs/DependencysManager';
import { MiddlewareBase } from './Middleware';

export abstract class RouteBase {
    public router: express.Router;
    protected dd: IDependencys;
    private path: string;

    constructor(
        config: {
            path?: string;
            childs?: RouteBase[];
            middlewares?: MiddlewareBase[];
        } = {}
    ) {
        this.path = config.path || '/';
        this.router = express.Router({
            mergeParams: true,
            strict: true,
        });
        this.dd = getDependencys();

        config.middlewares?.forEach((middleware) => {
            this.router.use((req, res, next) => middleware.run(req, res, next));
        });

        config.childs?.forEach((child) => {
            this.router.use(child.path, child.router);
        });

        if (this.run) {
            this.run();
        }
    }

    run(): void {
        return;
    }
}
