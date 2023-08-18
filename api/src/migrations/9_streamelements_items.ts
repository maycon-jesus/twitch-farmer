import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('streamelements_items', (table) => {
        table.string('id').primary();
        table.string('streamElementsUserId').notNullable();
        table.integer('cooldownUser').defaultTo(0);
        table.integer('cooldownGlobal').defaultTo(0);
        table.integer('cooldownCategory').defaultTo(0);
        table.integer('cost').defaultTo(0);
        table.string('name').notNullable();
        table.text('description').notNullable();
        table.string('category').defaultTo(null);
        table.text('thumbnailUrl').defaultTo(null);

        // Booleans
        table.tinyint('enabled').notNullable();
        table.tinyint('subscriberOnly').notNullable();
        table.tinyint('deleted').notNullable().defaultTo(0);
        table.tinyint('allowMessages').notNullable().defaultTo(0);

        table.integer('quantityTotal').notNullable();
        table.integer('quantityCurrent').notNullable();
        table.text('inputs').notNullable().defaultTo("[]");

        table.dateTime('createdAt').notNullable();
        table.dateTime('updatedAt').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('streamelements_points');
}
