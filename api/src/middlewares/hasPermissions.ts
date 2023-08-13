import type { NextFunction, Request, Response } from 'express';
import { MiddlewareBase } from '../base/Middleware';
import { ErrorMaker, ErrorToResponse } from '../libs/ErrorMaker';
import { RolePermissions } from '../controllers/Roles';

export class HasPermissionsMiddleware extends MiddlewareBase {
    private permissions: (keyof RolePermissions)[] = [];

    constructor(permissions: (keyof RolePermissions)[]) {
        super();
        this.permissions.push(...permissions);
    }

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.dd.users.findOne(req.jwt.userId);
            const userPerms = await this.dd.roles.getRolePermissions(user.role);
            for(const permission of this.permissions){
                if (!userPerms[permission])
                    throw new ErrorMaker({
                        type: 'forbidden',
                        errors: [{ message: 'Você não possui permissão para isso' }],
                    });
            }
            next();
        } catch (err: any) {
            const e = ErrorToResponse(err);
            res.status(e.status).json(e.error);
        }
    }
}
