// as customer I want to see all my tickets 
//  I want to create ticket
// update ticket
// delete a ticket

// imports 
const router = require( "express" ).Router();

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all the customers
router.get( "/", ( req, res, next ) =>
{
    res.send( "read all  customers wired" );
} );
// get a customer
router.get( "/:id", ( req, res, next ) =>
{
    res.send( "read customer wired" );
} );

// update a customer
router.put( "/:id", ( req, res, next ) =>
{
    res.send( "update customer wired" );
} );

// delete a customer 
router.delete( "/:id", ( req, res, next ) =>
{
    res.send( "delete customer wired" );
} );


module.exports = router;
