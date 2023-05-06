import { RouteBase } from '../../base/Route';
import { ErrorToResponse } from '../../libs/ErrorMaker';

export class PublicRegister extends RouteBase {
    constructor() {
        super({
            path: '/register',
        });
    }

    run(): void {
        this.router.get('/', async (req, res) => {
            try {
                const inviteCode = await this.dd.inviteCodes.generateInviteCode();
                res.redirect(process.env.FRONTEND_URL + `/registrar?invite-code=${inviteCode.code}`);
            } catch (err: any) {
                const e = ErrorToResponse(err);
                res.status(e.status).json(e.error);
            }
        });
    }
}
