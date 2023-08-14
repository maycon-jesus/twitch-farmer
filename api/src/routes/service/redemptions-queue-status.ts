import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';

export default class RouteRedemptionsQueueStatus extends RouteBase {
    bodyValidator = z.object({
        completed: z.boolean(),
        error: z.boolean(),
        errorReason: z.string().optional()
    });

    constructor() {
        super({
            path: '/redemptions-queue/:itemId/status'
        });
    }

    async run() {
        this.router.post('/', async (req, res) => {
            try {
                const itemId = (req.params as any).itemId as any;
                const body = this.bodyValidator.safeParse(req.body);
                if (!body.success)
                    throw new ErrorMaker({
                        type: 'form_validation',
                        errors: body.error.errors
                    });
                await this.dd.streamElementsRedemptionsQueue.setItemStatus({
                    itemId,
                    ...body.data
                })
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}