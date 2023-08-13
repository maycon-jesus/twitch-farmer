import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user_roles', (table) => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.tinyint('PERM_GENERATE_INVITE_CODE', 1).notNullable().defaultTo(0);
        table.integer('REDEMPTIONS_BOT_PRIORITY').notNullable().defaultTo(1)
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user_roles');
}
