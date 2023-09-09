import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('whispers', (table) => {
        table.string('id').primary();

        table.string('threadId').notNullable().references('whispers_threads.id')
        table.string('authorId').notNullable().references('twitch_users.id')
        table.text('message').notNullable()

        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('proxy_list_ping');
}
