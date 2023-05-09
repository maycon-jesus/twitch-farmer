import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('streamelements_points', (table) => {
        table.string('accountId').notNullable().references('twitch_accounts.id');
        table.string('channelId').notNullable().references('twitch_channels.id');
        table.integer('value').notNullable().defaultTo(0);

        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('streamelements_points');
}
