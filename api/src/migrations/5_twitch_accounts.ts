import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('twitch_accounts', (table) => {
        table.uuid('id').primary();
        table.string('ownerId');

        table.string('email').defaultTo(null);
        table.string('login').notNullable();
        table.string('userId').notNullable();
        table.string('displayName').notNullable();
        table.string('profileImageUrl').notNullable();

        table.string('accessToken').notNullable();
        table.string('refreshToken').notNullable();
        table.dateTime('tokenExpiresAt').notNullable();
        table.text('streamElementsToken').defaultTo(null);
        table.string('streamElementsUserId').defaultTo(null);

        table.text('notes').defaultTo(null);

        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.foreign('ownerId').references('users.id');

        // Meta
        table.tinyint('banned', 1);
        table.tinyint('tokenInvalid', 1);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('twitch_accounts');
}
