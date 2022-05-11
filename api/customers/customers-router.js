// as customer I want to see all my tickets 
//  I want to create ticket
// update ticket
// delete a ticket

// imports 
const router = require( "express" ).Router();
const { findAll, findById } = require( "../customers/customers-model" );

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all the customers
router.get( "/", async ( req, res ) =>
{
    try
    {
        // grab all customers from the data base
        const customers = await findAll();

        // send status code with the customers object
        res.status( 200 ).json( customers );
    }

    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error un the server",
            cause: error.message
        } );
    }
} );

// get a customer
router.get( "/:id", async ( req, res ) =>
{
    try
    {
        // grab id from the request parameter
        const { id } = req.params;

        // find customer by id
        const customer = await findById( id );

        // send customer back with status code SUCCESS
        res.status( 200 ).json( customer );
    }


    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error un the server",
            cause: error.message
        } );
    }
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
