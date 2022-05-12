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
    // from the tickets table find the ticket column with the id specified and return it 
    return db( "tickets" ).where( "ticket_id", id ).first(); // if first not pass we will receive an array 
};

// create a ticket 
const createTicket = async ( ticket ) =>
{
    // from the tickets column insert the ticket object
    return db( "tickets" ).insert( ticket );
};

const updateTicket = async ( id, changes ) =>
{
    // find ticket and update 
    await db( "tickets" ).where( "ticket_id", id ).update( changes );

    // find ticket
    const ticket = await getTicketById( id );

    // return ticket
    return ticket;
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket
};

