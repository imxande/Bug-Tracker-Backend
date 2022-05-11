// import express and create router
const router = require( "express" ).Router();
// 
const { createTicket } = require( "./tickets-model" );

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all tickets
router.get( "/", ( rq, res ) =>
{
    res.send( "Get all tickets wired!" );
} );

// get a ticket by id
router.get( "/:id", ( rq, res ) =>
{
    res.send( "Get all tickets wired!" );
} );

// create a ticket
router.post( "/", async ( req, res ) =>
{
    // grab ticket info from request body
    const ticket = req.body;

    // add ticket to the database
    const [ id ] = await createTicket( ticket );

    console.log( id );

    res.send( "All good to go!" );
} );

// edit a ticket
router.put( "/", ( rq, res ) =>
{
    res.send( "Get all tickets wired!" );
} );

// delete a ticket
router.delete( "/", ( rq, res ) =>
{
    res.send( "Get all tickets wired!" );
} );

// assign a ticket

module.exports = router;