// imports 
const router = require( "express" ).Router();
const { findAll, findById, updateCustomer, deleteCustomer } = require( "../customers/customers-model" );
const { restricted, adminAccess } = require( "../auth/auth-middleware" );

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all the customers
router.get( "/", restricted, adminAccess, async ( req, res, next ) =>
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
        // send error to client
        next( { error } );
    }
} );

// get a customer
router.get( "/:id", restricted, adminAccess, async ( req, res, next ) =>
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
        // send error to client
        next( { error } );
    }
} );

// update a customer
router.put( "/:id", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // grab id from request parameter
        const { id } = req.params;

        // grab payload from the request body
        const payload = req.body;

        // update the customer
        await updateCustomer( id, payload );

        // send status code with the updated customer
        res.status( 200 ).json( {
            message: "Customer has been updated!"
        } );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// delete a customer 
router.delete( "/:id", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        //  grab id from request parameters
        const { id } = req.params;

        //  find customer to be deleted
        const customer = await findById( id );

        // delete user using id
        deleteCustomer( id );

        // send deleted customer with status code
        res.status( 200 ).json( customer );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );


module.exports = router;
