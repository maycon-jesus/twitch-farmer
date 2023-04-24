import express from 'express';
import { IDependencys, getDependencys } from '../libs/DependencysManager';
import type { Request, Response } from 'express';
import { MiddlewareBase } from './Middleware';

export type RouteMethods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'use';

export abstract class RouteBase {
    public router: express.Router;
    private path: string;
    protected dd: IDependencys;

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

    abstract run?(): void;
}
