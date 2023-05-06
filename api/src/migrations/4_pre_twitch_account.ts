import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('pre_twitch_account', (table) => {
        table.uuid('code').primary();
        table.string('ownerId');
        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.foreign('ownerId').references('users.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('pre_twitch_account')
}
