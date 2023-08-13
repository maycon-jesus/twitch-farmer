import { ControllerBase } from '../base/Controller';
import { ErrorMaker } from '../libs/ErrorMaker';

export interface RolePermissions {
    PERM_GENERATE_INVITE_CODE: 0 | 1,
    REDEMPTIONS_BOT_PRIORITY: number
}

export class RolesController extends ControllerBase {
    async getRolePermissions(roleId: string): Promise<RolePermissions> {
        const role = await this.dd.database.db('user_roles').where({ id: roleId }).first();
        if (!role)
            throw new ErrorMaker({
                type: 'not_found',
                errors: [
                    {
                        message: `Cargo "${roleId}" não encontrado`
                    }
                ]
            });

        return Object.entries(role).reduce((p: Record<string, any>, v) => {
            p[v[0]] = v[1];
            return p;
        }, {
            PERM_GENERATE_INVITE_CODE: 0,
            REDEMPTIONS_BOT_PRIORITY: 1
        }) as any;
    }
}
