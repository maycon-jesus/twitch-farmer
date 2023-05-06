import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('invite_codes', (table) => {
        table.uuid('code').primary();
        table.string('ownerId');
        table.string('usedBy').defaultTo(null);
        table.boolean('used').notNullable().defaultTo(false);
        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.foreign('ownerId').references('users.id');
        table.foreign('usedBy').references('users.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('invite_codes');
}
