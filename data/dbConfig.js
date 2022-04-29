// import knex library
const knex = require("knex");

// Bring our configuration from our knex file
const knexConfig = require("../knexFile");

// setting up the right environment will need to check later
const development = process.env.NODE_ENV || "development";

// export our configuration
module.exports = knex(knexConfig[development]);
