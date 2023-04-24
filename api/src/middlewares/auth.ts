import type { Request, Response, NextFunction } from 'express';
import { MiddlewareBase } from '../base/Middleware';
import { ErrorMaker, ErrorToResponse } from '../libs/ErrorMaker';

export class AuthMiddleware extends MiddlewareBase {
    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const headerAuth = req.headers.authorization;
            if (!headerAuth)
                throw new ErrorMaker({
                    type: 'forbidden',
                    errors: [{ message: 'Forneça o header "authorization" com o token de autorização' }],
                });
            const payload = await this.dd.auth.validateToken(headerAuth);
            req.jwt = payload;
            next();
        } catch (err: any) {
            const e = ErrorToResponse(err);
            res.status(e.status).json(e.error);
        }
    }
}
