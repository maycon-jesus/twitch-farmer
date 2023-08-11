import { MiddlewareBase } from '../base/Middleware';
import { NextFunction, Request, Response } from 'express';
import { ErrorMaker, ErrorToResponse } from '../libs/ErrorMaker';

export class TwitchAccountsMiddleware extends MiddlewareBase {
    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const account = await this.dd.twitchAccounts.getAccountById(req.params.accountId);
            if (account.ownerId !== req.jwt.userId)
                throw new ErrorMaker({
                    type: 'forbidden',
                    errors: [{ message: 'Você não possui acesso a isso!' }],
                });
            next();
        } catch (e: any) {
            const err = ErrorToResponse(e);
            res.status(err.status).json(err.error);
        }
    }
}
