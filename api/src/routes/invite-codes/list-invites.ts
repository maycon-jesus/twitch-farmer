import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';

export class InviteCodesListRoute extends RouteBase {
    run(): void {
        const validation = z.object({
            page: z.number().int().min(1).optional().default(1),
            limit: z.number().int().min(1).max(100).optional().default(25),
        });
        this.router.get('/', async (req, res) => {
            try {
                const query = validation.safeParse(req.query);
                if (!query.success)
                    throw new ErrorMaker({
                        type: 'form_validation',
                        errors: query.error.errors,
                    });

                const invites = await this.dd.inviteCodes.listInvites({
                    ownerId: req.jwt.userId,
                    page: query.data.page,
                    limit: query.data.limit,
                });
                const invitesCount = await this.dd.inviteCodes.countInvites({
                    ownerId: req.jwt.userId,
                });
            } catch (err: any) {
                const e = ErrorToResponse(err);
                res.status(e.status).json(e.error);
            }
        });
    }
}
