// import knex library
const knex = require("knex");

// Bring our configuration from our knex file
const config = require("../knexFile");

// setting up the right environment will need to check later
const DB_ENV = process.env.DB_ENV || "development";

// export our configuration
module.exports = knex(config[DB_ENV]);
