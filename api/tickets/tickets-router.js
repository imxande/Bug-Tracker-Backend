// import express and create router
const router = require( "express" ).Router();

// imports from tickets model
const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require( "./tickets-model" );

// import auth middleware
const { restricted, adminAccess, ticketAccess } = require( "../auth/auth-middleware" );

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// all tickets should be access by admin only 
router.get( "/", restricted, adminAccess, async ( req, res ) =>
{
    try
    {
        // get all the tickets from the data base
        const tickets = await getAllTickets();

        // send status code and all the tickets in the response 
        res.status( 200 ).json( tickets );
    }

    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error on the server",
            cause: error.message
        } );
    }
} );

// get a ticket by id - a ticket can be checked by the owner/customer of the ticket and an employee with admin access
router.get( "/:id", restricted, ticketAccess, async ( req, res ) =>
{
    try
    {
        // grab id from request params
        const { id } = req.params;

        // find ticket by id
        const ticket = await getTicketById( id );

        // send status with the ticket
        res.status( 200 ).json( ticket );
    }

    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error on the server",
            cause: error.message
        } );
    }
} );

// create a ticket
router.post( "/", async ( req, res ) =>
{
    try
    {
        // grab ticket info from request body
        const ticket = req.body;

        // add ticket to the database
        const [ id ] = await createTicket( ticket );

        // send status code with id of the ticket created
        res.status( 200 ).json( id );
    }

    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error on the server",
            cause: error.message
        } );
    }
} );

// edit a ticket
router.put( "/:id", async ( req, res ) =>
{
    // grab id from params 
    const { id } = req.params;

    // grab changes from the request body
    const changes = req.body;

    // create a new ticket with the changes
    const newTicket = await updateTicket( id, changes );

    // send status code with message
    res.status( 200 ).json( newTicket );
} );

// delete a ticket
router.delete( "/:id", ( req, res ) =>
{
    try
    {
        // grab id from request parameters
        const { id } = req.params;

        // find and delete the ticket
        const deletedTicket = deleteTicket( id );

        // send message and status
        res.status( 200 ).json( deletedTicket );

    }

    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error on the server",
            cause: error.message
        } );
    }
} );

// assign a ticket

module.exports = router;