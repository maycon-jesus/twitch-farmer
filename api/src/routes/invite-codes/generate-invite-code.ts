import { RouteBase } from '../../base/Route';
import { ErrorToResponse } from '../../libs/ErrorMaker';

export class InviteCodesGenerateRoute extends RouteBase {
    run(): void {
        this.router.post('/', async (req, res) => {
            try {
                const inviteCode = await this.dd.inviteCodes.generateInviteCode({ ownerId: req.jwt.userId });
                res.json({ code: inviteCode.code });
            } catch (err: any) {
                const e = ErrorToResponse(err);
                res.status(e.status).json(e.error);
            }
        });
    }
}
