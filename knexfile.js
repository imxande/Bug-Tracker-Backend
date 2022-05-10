// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    //  Database management system driver
    client: "sqlite3",
    connection: {
      filename: "./data/help_desk.db3",
    },
    // necessary when using sqlite3
    useNullAsDefault: true,

    // enable foreign keys
    pool: {
      afterCreate: ( conn, done ) =>
      {
        // runs after a connection is made to the sqlite engine
        conn.run( "PRAGMA foreign_keys = ON", done ); // turn on FK enforcement
      },
    },

    // Generates migrations files in specified folder
    migrations: {
      directory: "./data/migrations",
    },

    // Generates seed file in specified folder
    seeds: {
      directory: "./data/seeds",
    },
  },
};
