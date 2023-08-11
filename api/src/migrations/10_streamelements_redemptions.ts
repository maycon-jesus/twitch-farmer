import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('streamelements_redemptions', (table) => {
        table.string('id').primary();
        table.string('itemId').nullable().defaultTo(null).references('streamelements_items.id');
        table.string('accountId').notNullable().references('twitch_accounts.id')
        table.string('channelId').notNullable().references('twitch_channels.id')
        table.string('ownerId').notNullable().references('users.id')
        table.text('accessCode').nullable().defaultTo(null)
        table.string('inputs').notNullable().defaultTo("[]");
        table.tinyint('completed', 1).defaultTo(0)
        table.tinyint('rejected', 1).defaultTo(0)

        table.dateTime('createdAt').notNullable();
        table.dateTime('updatedAt').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('streamelements_redemptions');
}
