import { MiddlewareBase } from '../base/Middleware';
import { NextFunction, Request, Response } from 'express';
import { ErrorMaker, ErrorToResponse } from '../libs/ErrorMaker';

export class TwitchChannelsMiddleware extends MiddlewareBase {
    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const channel = await this.dd.twitchChannels.getChannel(req.params.channelId);
            if (!channel)
                throw new ErrorMaker({
                    type: 'not_found',
                    errors: [{ message: 'Canal não encontrada!' }],
                });
            if (channel.ownerId !== req.jwt.userId)
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
