import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('redemption_data_profiles_used', (table) => {
        table.string('idRedemptionDataProfile').references('redemption_data_profiles.id').notNullable();
        table.string('idRedemptionQueue').references('streamelements_redemptions_queue.id').notNullable();
        table.primary(['idRedemptionDataProfile', 'idRedemptionQueue']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('redemption_data_profiles_used');
}
