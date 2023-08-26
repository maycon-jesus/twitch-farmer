import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('redemption_data_profiles', (table) => {
        table.string('id').notNullable().primary()
        table.string('ownerId').notNullable().references('users.id')
        table.string('accountId').defaultTo(null).references('twitch_accounts.id')
        table.text('nameComplete')
        table.text('firstName')
        table.text('pix')
        table.text('steamTradeLink')
        table.text('email')
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('13_redemption_data_profiles.ts');
}
