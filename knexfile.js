// Update with your config settings.

// We will use this common parameters for the different phases of this project
const prevalent = {
	//  Database management system driver
	client: "sqlite3",
	// necessary when using sqlite3
	useNullAsDefault: true,
	// enable foreign keys
	pool: {
		afterCreate: (conn, done) => {
			// runs after a connection is made to the sqlite engine
			conn.run("PRAGMA foreign_keys = ON", done); // turn on FK enforcement
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
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		// our common parameters check definition on the very top of this file
		...prevalent,
		// connection to our database
		connection: {
			filename: "./data/help_desk.db3",
		},
	},
	testing: {
		// our common parameters check definition on the very top of this file
		...prevalent,
		// connection to our test database
		connection: {
			filename: "./data/test.db3",
		},
	},
	production: {
		// our common parameters check definition on the very top of this file
		...prevalent,
		// connection to our database
		connection: {
			filename: "./data/help_desk.db3",
		},
	},
};
