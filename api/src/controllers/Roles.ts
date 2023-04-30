import {ControllerBase} from '../base/Controller';
import {ErrorMaker} from '../libs/ErrorMaker';

export type RolePermission = 'GENERATE_INVITE_CODE';

export class RolesController extends ControllerBase {
    async getRolePermissions(roleId: string): Promise<RolePermission[]> {
        const role = await this.dd.database.db('user_roles').where({id: roleId}).first();
        if (!role)
            throw new ErrorMaker({
                type: 'not_found',
                errors: [
                    {
                        message: `Cargo "${roleId}" não encontrado`,
                    },
                ],
            });

        return Object.entries(role).reduce<RolePermission[]>((p, v) => {
            if (v[0].startsWith('PERM_') && v[1]) {
                p.push(v[0].replace('PERM_', '') as RolePermission);
                return p;
            }
            return p;
        }, []);
    }
}
