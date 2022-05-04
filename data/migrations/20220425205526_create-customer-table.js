/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function ( knex )
{
  return knex.schema.createTable( "customers", ( table ) =>
  {
    // increment column id for customers
    table.increments( "customer_id" );
    // customer first name
    table.string( "firstName", 64 ).notNullable();
    // customer last name
    table.string( "lastName", 64 ).notNullable();
    // email
    table.string( "email", 64 ).notNullable().unique();
    // here we will store the hash
    table.varchar( "password", 255 ).notNullable();
  } );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function ( knex )
{
  return knex.schema.dropTableIfExists( "customers" );
};
