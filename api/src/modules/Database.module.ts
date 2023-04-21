import Knex from "knex";
import type { Knex as IKnex } from "knex";
import path from "path";

export class DatabaseModule {
  db: IKnex;

  constructor() {
    this.db = Knex({
      client: "mysql2",
      connection: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
      },
      migrations: {
        directory: path.join(__dirname, "../migrations"),
        tableName: "migrations",
      },
      seeds: {
        directory: path.join(__dirname, "../seeds"),
      },
    });
  }

  runMigrations() {
    return this.db.migrate.latest();
  }

  runSeeds() {
    return this.db.seed.run();
  }
}
