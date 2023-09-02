import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('whispers', (table) => {
        table.string('authorId').notNullable().references('twitch_users.id')
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('proxy_list_ping');
}
