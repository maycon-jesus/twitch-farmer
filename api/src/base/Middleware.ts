import type { Request, Response, NextFunction } from 'express';
import { IDependencys, getDependencys } from '../libs/DependencysManager';

export abstract class MiddlewareBase {
    protected dd: IDependencys = getDependencys();

    abstract run(req: Request, res: Response, next: NextFunction): void;
}
