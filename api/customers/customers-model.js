// import data base knex configuration
const db = require( "../../data/config/dbConfig" );

// find method 
const findAll = async () =>
{
    // return all customers
    return db( "customers" );
};

// method to find an entry by its ID 
const findById = async ( id ) =>
{
    // find in the customers table the entry with specified ID. We will us first method here to avoid the nested collection 
    return db( "customers" ).where( "customer_id", id ).first(); // note that where will return a collection array without the first method invoke
};

// find by filter
const findBy = async ( filter ) =>
{
    // check data base for filter value and return the password
    return db( "customers" ).where( "email", filter ).select( "password" );

};

// add a customer (object) method
const add = async ( customer ) =>
{
    //  get id from the newly inserted customer, insert will return the id of the newly created customer
    const [ id ] = await db( "customers" ).insert( customer );
    // find the record by its id and send it to the router handler
    return findById( id );
};


module.exports = {
    findAll,
    add,
    findById,
    findBy
};
