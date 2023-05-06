import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('secrets', (table) => {
        table.string('name').primary();
        table.string('value').notNullable();
        table.dateTime('expiresAt').defaultTo(null);

        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('secrets');
}
