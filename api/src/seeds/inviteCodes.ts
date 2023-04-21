import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    const rows = await knex('users').count<[{ count: number }]>('id as count');
    if (rows[0].count > 0) return;

    await knex('invite_codes').insert({
        code: '10497865-47df-477b-8ee9-b085ec4ca2e4',
    });
}
