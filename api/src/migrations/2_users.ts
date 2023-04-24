import { Knex } from 'knex';

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary();
        table.string('firstName').notNullable();
        table.string('lastName').notNullable();
        table.text('email', 'TEXT').notNullable();
        table.string('password').notNullable();
        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.uuid('role').notNullable();
        table.foreign('role').references('user_roles.id');
    });
}

export async function down(knex: Knex): Promise<void> {}
