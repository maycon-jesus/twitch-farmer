import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    const cols = await knex('user_roles').count<[{ count: number }]>('id as count');
    if (cols[0].count > 0) return;

    await knex('user_roles').insert([
        { id: 'admin', name: 'Admin', PERM_GENERATE_INVITE_CODE: 1 },
        { id: 'founder', name: 'Fundador', PERM_GENERATE_INVITE_CODE: 1 },
        { id: 'user', name: 'Usuário', PERM_GENERATE_INVITE_CODE: 0 },
    ]);
}
