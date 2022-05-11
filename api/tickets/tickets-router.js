// import express and create router
const router = require( "express" ).Router();
// 
const { createTicket, getAllTickets } = require( "./tickets-model" );

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all tickets
router.get( "/", async ( req, res ) =>
{
    try
    {
        const tickets = await getAllTickets();

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

// get a ticket by id
router.get( "/:id", ( req, res ) =>
{
    res.send( "Get all tickets wired!" );
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
router.put( "/", ( req, res ) =>
{
    res.send( "Get all tickets wired!" );
} );

// delete a ticket
router.delete( "/", ( req, res ) =>
{
    res.send( "Get all tickets wired!" );
} );

// assign a ticket

module.exports = router;