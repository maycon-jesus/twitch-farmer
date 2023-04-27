import { ControllerBase } from '../base/Controller';
import { ErrorMaker } from '../libs/ErrorMaker';
import { v4 } from 'uuid';

interface IInviteCode {
    ownerId: string;
    usedBy: string;
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
                type: 'forbidden',
                errors: [
                    {
                        message: 'Código de convite não existe ou é inválido!',
                    },
                ],
            });
        return c;
    }

    async markInviteUsed(code: string, usedBy: string) {
        await this.dd.database.db('invite_codes').where({ code }).update({ used: 1, usedBy });
    }

    async generateInviteCode(data: { ownerId: string }) {
        const code = v4();
        await this.dd.database.db('invite_codes').insert({
            code,
            ownerId: data.ownerId,
        });
        return {
            code,
        };
    }

    async listInvites(data: { ownerId: string; page: number; limit: number }): Promise<IInviteCode[]> {
        const offset = data.page * data.limit - data.limit;
        return await this.dd.database
            .db('invite_codes')
            .where({ ownerId: data.ownerId })
            .offset(offset)
            .limit(data.limit)
            .orderBy('createdAt', 'desc');
    }

    async countInvites(data: { ownerId: string }): Promise<{ count: number }> {
        const [{ count }] = await this.dd.database
            .db('invite_codes')
            .where({ ownerId: data.ownerId })
            .count<[{ count: number }]>('code as count');
        return { count };
    }
}
