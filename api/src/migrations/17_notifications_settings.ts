import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('notifications_settings', (table) => {
        table.string('userId').primary().references('users.id')
        table.tinyint('enableRedemptions',1).defaultTo(1).notNullable()
        table.tinyint('enableWhispers',1).defaultTo(1).notNullable()
        table.string('telegramUsername').defaultTo(null)
        table.string('telegramChatId').defaultTo(null)
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('notifications_settings');
}
