// import knex library
const knex = require("knex");

// import our dotenv file
require("dotenv").config;

// Bring our configuration from our knex file
const knexConfig = require("../../knexfile");

// setting up the right environment will need to check later
const environment = process.env.DB_ENV;

// export our configuration
module.exports = knex(knexConfig[environment]);
