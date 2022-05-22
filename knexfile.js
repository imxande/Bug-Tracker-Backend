// Update with your config settings.

// we will be using this common parameters throughout the different stages
const prevalent = {
	//  Database management system driver
	client: "sqlite3",

	// necessary when using sqlite3
	useNullAsDefault: true,

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
		...prevalent,
		// connection to our database
		connection: {
			filename: "./data/help_desk.db3",
		},
	},
};
