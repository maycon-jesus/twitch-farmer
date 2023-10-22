import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('streamelements_redemptions_queue', (table) => {
        table.string('id').primary();
        table.string('itemId').notNullable().references('streamelements_items.id');
        table.string('accountId').notNullable().references('twitch_accounts.id')
        table.string('channelId').notNullable().references('twitch_channels.id')
        table.string('ownerId').notNullable().references('users.id')
        table.tinyint('completed', 1).defaultTo(0)
        table.tinyint('error', 1).defaultTo(0)
        table.tinyint('suspended', 1).defaultTo(0)
        table.string('errorReason').nullable().defaultTo(null)
        table.text('inputs').notNullable()
        table.integer('priority').notNullable().defaultTo(1)
        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('streamelements_redemptions_queue');
}
