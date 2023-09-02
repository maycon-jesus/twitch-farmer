import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';

export default class RouteRedemptionsQueueStatus extends RouteBase {
    bodyValidator = z.object({
        completed: z.boolean(),
        error: z.boolean(),
        errorReason: z.string().optional(),
        accessCode: z.string().optional()
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
                const registry = await this.dd.streamElementsRedemptionsQueue.getItemFromQueue({
                    id: itemId
                });
                if (!registry) throw new ErrorMaker({
                    type: 'not_found',
                    errors: [{ message: 'Registro não encontrado!' }]
                });
                if (registry.completed && !registry.error) return res.json({});
                await this.dd.streamElementsRedemptionsQueue.setItemStatus({
                    itemId,
                    completed: body.data.completed,
                    error: body.data.error,
                    errorReason: body.data.errorReason
                });

                if (body.data.completed && !body.data.error) {
                    const channel = await this.dd.twitchChannels.getChannel(registry.channelId);
                    const account = await this.dd.twitchAccounts.getAccountById(registry.accountId);
                    const item = await this.dd.streamElementsItems.getItem(registry.itemId);
                    if (item) {
                        await this.dd.notifications.sendRedemptionNotification(registry.ownerId, {
                            itemName: item.name,
                            accountName: account.displayName,
                            channelName: channel.displayName,
                            accessCode: body.data.accessCode
                        })
                    }
                }

                res.json({});
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}