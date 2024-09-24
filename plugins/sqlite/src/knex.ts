import path from "path";
import knex, { Knex } from "knex";
import Dialect from "knex/lib/dialects/sqlite3";

let knexClient: Knex;

const migrationConfig: Knex.MigratorConfig = {
  tableName: "migrations",
  directory: path.join(__dirname, "..", "build", "Migrations"),
  // Fixes the error: The migration directory is corrupt, the following files are missing:
  disableMigrationsListValidation: true,
};

/**
 * Sets up the knex connection.
 */
export async function setupKnex(data: any) {
  const filename = data.file;

  knexClient = knex({
    client: Dialect,
    connection: { filename },
    useNullAsDefault: true,
  });

  await knexClient.migrate.latest(migrationConfig);
  await knexClient.raw("PRAGMA foreign_keys = ON");
}

/**
 * Destroys the knex connection.
 */
export async function destroyKnex() {
  knexClient?.destroy();
}

export { knexClient };
