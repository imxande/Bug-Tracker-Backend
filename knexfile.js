// Update with your config settings.
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    //  Database management system driver
    client: "sqlite3",
    connection: {
      filename: process.env.DATABASE_FILENAME,
    },
    // necessary when using sqlite3
    useNullAsDefault: true,
  },
  // Generates migrations files in specified folder
  migrations: {
    directory: "./data/migrations",
  },
  // Generates seed file in specified folder
  directory: "./data/seeds",
};
