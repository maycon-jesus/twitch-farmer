import type { Request, Response, NextFunction } from 'express';
import { MiddlewareBase } from '../base/Middleware';
import { ErrorMaker, ErrorToResponse } from '../libs/ErrorMaker';
import { RolePermission } from '../controllers/Roles';

export class HasPermissionsMiddleware extends MiddlewareBase {
    private permissions: RolePermission[] = [];
    constructor(permissions: RolePermission[]) {
        super();
        this.permissions.push(...permissions);
    }

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.dd.users.findOne(req.jwt.userId);
            const userPerms = await this.dd.roles.getRolePermissions(user.role);
            const notHasSomePerm = userPerms.some((userPerm) => !this.permissions.includes(userPerm));
            if (notHasSomePerm)
                throw new ErrorMaker({
                    type: 'forbidden',
                    errors: [{ message: 'Você não possui permissão para isso' }],
                });
            next();
        } catch (err: any) {
            const e = ErrorToResponse(err);
            res.status(e.status).json(e.error);
        }
    }
}
