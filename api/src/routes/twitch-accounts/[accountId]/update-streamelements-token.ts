import { RouteBase } from '../../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../../libs/ErrorMaker';

export default class UpdateStreamelementsTokenRoute extends RouteBase {
    private bodyValidator = z.object({
        token: z.string().default(''),
    });

    constructor() {
        super({
            path: '/streamelements-token',
        });
    }

    run() {
        this.router.post('/', async (req, res) => {
            try {
                const body = this.bodyValidator.safeParse(req.body);
                const params: any = req.params;
                if (!body.success)
                    throw new ErrorMaker({
                        type: 'form_validation',
                        errors: body.error.errors,
                    });
                await this.dd.twitchAccounts.setStreamElementsToken(params.accountId, body.data.token);
                res.json({ success: true });
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
