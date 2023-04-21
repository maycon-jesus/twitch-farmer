import { RouteBase } from '../../../base/Route';
import type { Request, Response } from 'express';
import { ErrorToResponse } from '../../../libs/ErrorMaker';

export class UsersMeGetInfoRoute extends RouteBase {
    run(): void {
        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const { id, firstName, lastName, role } = await this.dd.users.findOne(req.jwt.userId);
                res.json({ id, firstName, lastName, role });
            } catch (err: any) {
                const e = ErrorToResponse(err);
                res.status(e.status).json(e.error);
            }
        });
    }
}
