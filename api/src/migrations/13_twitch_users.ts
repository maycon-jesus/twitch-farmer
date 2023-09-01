import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('twitch_users', (table) => {
        table.string('id').notNullable().primary();
        table.string('login').notNullable();
        table.string('displayName').notNullable();
        table.string('profileImageUrl').notNullable();

        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('twitch_users');
}
