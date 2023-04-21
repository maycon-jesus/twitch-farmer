import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_roles', (table) => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.tinyint('PERM_GENERATE_INVITE_CODE', 1).defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user_roles');
}
