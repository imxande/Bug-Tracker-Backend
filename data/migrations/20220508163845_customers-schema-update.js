/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function ( knex )
{
    // return schema
    return (
        knex.schema
            // create customers table
            .createTable( "customers", ( table ) =>
            {
                // create customer id column
                table.increments( "customer_id" );
                // customer first name
                table.string( "firstName", 64 ).notNullable();
                // customer last name
                table.string( "lastName", 64 ).notNullable();
                // email
                table.string( "email", 64 ).notNullable().unique();
                // here we will store the hash
                table.varchar( "password", 255 ).notNullable();
                // customers will have a regular user role
                table.string( "role", 12 ).notNullable();
            } )
            // create employees table
            .createTable( "employees", ( table ) =>
            {
                // create employees id
                table.increments( "employee_id" );
                // employees first name
                table.string( "firstName", 64 ).notNullable();
                // employees last name
                table.string( "lastName", 64 ).notNullable();
                // employees email
                table.string( "email", 64 ).notNullable().unique();
                // employees password
                table.varchar( "password", 255 ).notNullable();
                // employees role
                table.string( "role", 12 ).notNullable();
            } )
            // create tickets table
            .createTable( "tickets", ( table ) =>
            {
                // create a ticket id
                table.increments( "ticket_id" );
                // reference to customer that created the ticket
                table
                    .integer( "customer_id" )
                    .unsigned()
                    .notNullable()
                    .references( "customer_id" )
                    .inTable( "customers" )
                    .onDelete( "CASCADE" )
                    .onUpdate( "CASCADE" );
                // reference to employee that has been assigned to solve the ticket
                table
                    .integer( "employee_id" )
                    .unsigned()
                    .notNullable()
                    .references( "employee_id" )
                    .inTable( "employees" )
                    .onDelete( "CASCADE" )
                    .onUpdate( "CASCADE" );
                // create ticket subject
                table.string( "subject", 60 ).notNullable();
                // date the ticket was created
                table.string( "date", 20 ).notNullable();
                // ticket status
                table.string( "status", 11 ).notNullable();
            } )
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function ( knex )
{
    return knex.schema
        .dropTableIfExists( "tickets" )
        .dropTableIfExists( "employees" )
        .dropTableIfExists( "customers" );
};
