import { ControllerBase } from '../base/Controller';
import { ErrorMaker } from '../libs/ErrorMaker';

interface IInviteCode {
    id: number;
    code: string;
    used: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class InviteCodesController extends ControllerBase {
    async getInviteByCode(code: string): Promise<IInviteCode> {
        const c = await this.dd.database.db('invite_codes').where({ code }).first();
        if (!c)
            throw new ErrorMaker({
                type: 'not_found',
                errors: [
                    {
                        message: 'Código de convite não encontrado',
                    },
                ],
            });
        return c;
    }

    async markInviteUsed(code: string) {
        await this.dd.database.db('invite_codes').where({ code }).update({ used: 1 });
    }
}
