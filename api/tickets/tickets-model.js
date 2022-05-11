// import knex config
const db = require( "../../data/config/dbConfig" );

// get all tickets method
const getAllTickets = () =>
{
    return db( "tickets" );
};

// get ticket by id 
const getTicketById = async ( id ) =>
{
    return db( "tickets" ).where( "ticket_id", id ).first(); // if first not pass we will receive an array 
};

// create a ticket 
const createTicket = async ( ticket ) =>
{
    return db( "tickets" ).insert( ticket );
};

module.exports = {
    // findTickets,
    createTicket,
    getTicketById,
    getAllTickets

};

