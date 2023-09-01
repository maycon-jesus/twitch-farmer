import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('whispers_threads', (table) => {
        table.string('id').notNullable().primary()
        table.string('twitchUserId1').notNullable().references('twitch_users.id')
        table.string('twitchUserId2').notNullable().references('twitch_users.id')

        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('proxy_list_ping');
}
