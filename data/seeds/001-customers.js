
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// import dotenv library
require( "dotenv" ).config();

exports.seed = async function ( knex )
{
  // Deletes ALL existing entries
  await knex( "customers" ).del();
  await knex( "customers" ).insert( [
    {
      customer_id: 1,
      firstName: "Zavier",
      lastName: "Yolanda",
      email: "zavier@test.test",
      password: `${ process.env.CUSTOMER_PASSWORD };aldjfa;lkdfj`,
      role: "regular user"
    },
    {
      customer_id: 2,
      firstName: "Herman",
      lastName: "Suzi",
      email: "herman@test.test",
      password: `${ process.env.CUSTOMER_PASSWORD }wlkejkltjweltk`,
      role: "regular user"
    },
    {
      customer_id: 3,
      firstName: "Siri",
      lastName: "Minta",
      email: "minta@test.test",
      password: `${ process.env.CUSTOMER_PASSWORD }iweua;nsdgn`,
      role: "regular user"
    },
    {
      customer_id: 4,
      firstName: "Abigayle",
      lastName: "Janine",
      email: "abigayle@test.test",
      password: `${ process.env.CUSTOMER_PASSWORD }7t6rdhuahskl`,
      role: "regular user"
    }
  ] );
};
