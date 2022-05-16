// import ticket model
const { getTicketById } = require( "../tickets/tickets-model" );

// check if a ticket exist
const ticketPresence = async ( req, res, next ) =>
{
    // grab ticket id from params
    const { id } = req.params;

    // get ticket by id
    const ticket = await getTicketById( id );

    // check if ticket exist
    if ( !ticket )
    {
        res.status( 404 ).json( `Ticket with id of ${ id } does not exist!` );
    }

    // otherwise wrap everything up and call next middleware
    else next();
};

module.exports = ticketPresence;