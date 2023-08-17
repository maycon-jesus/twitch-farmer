import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('proxy_list_ping', (table) => {
        table.string('ip').primary();
        table.integer('streamElementsRedemptionPing').defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('proxy_list_ping');
}
