import type { Knex } from "knex";

// Update with your config settings.

const config: Knex.Config = {
  migrations: {
    directory: "src/migrations",
  },
  seeds: {
    directory: "src/seeds",
  },
};

module.exports = config;
