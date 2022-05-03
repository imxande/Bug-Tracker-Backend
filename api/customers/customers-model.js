// import data base knex configuration
const db = require( "../../data/dbConfig" );

module.exports = {
    find,
    add,
    findById,
};

// find method 
const find = () =>
{
    // return all customers
    return db( "customers" ).select( "id", "email" );
};

const findById = ( id ) =>
{
    // find in the customers table the entry with specified ID
    return db( "customers" ).where( "id", id );
};

// add a customer (object) method
const add = ( customer ) =>
{
    //  add customer to the data base 
    return db( "customers" ).insert( customer, "id" ).then( ( [ id ] ) =>
    {
        //  find relater customer and send it to our handler 
        return findById( id );
    } );
};