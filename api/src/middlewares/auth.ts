import type {NextFunction, Request, Response} from 'express';
import {MiddlewareBase} from '../base/Middleware';
import {ErrorMaker, ErrorToResponse} from '../libs/ErrorMaker';

export class AuthMiddleware extends MiddlewareBase {
    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const headerAuth = req.headers.authorization;
            if (!headerAuth)
                throw new ErrorMaker({
                    type: 'forbidden',
                    errors: [{message: 'Forneça o header "authorization" com o token de autorização'}],
                });
            req.jwt = await this.dd.auth.validateToken(headerAuth);
            next();
        } catch (err: any) {
            const e = ErrorToResponse(err);
            res.status(e.status).json(e.error);
        }
    }
}
