// import knex config
const db = require( "../../data/config/dbConfig" );



// 
const createTicket = async ( ticket ) =>
{
    return db( "tickets" ).insert( ticket );
};

module.exports = {
    // findTickets,
    // findTicketById,
    createTicket,

};

