// import knex config
const db = require( "../../data/config/dbConfig" );

// get all tickets method
const getAllTickets = () =>
{
    return db( "tickets" );
};

// create a ticket 
const createTicket = async ( ticket ) =>
{
    return db( "tickets" ).insert( ticket );
};

module.exports = {
    // findTickets,
    // findTicketById,
    createTicket,
    getAllTickets

};

