// imports 
const router = require( "express" ).Router();
const { findAll, findById, updateCustomer, deleteCustomer } = require( "../customers/customers-model" );
const { restricted } = require( "../auth/auth-middleware" );

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all the customers
router.get( "/", restricted, async ( req, res ) =>
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
router.put( "/:id", ( req, res ) =>
{
    try
    {
        // grab id from request parameter
        const { id } = req.params;

        // grab payload from the request body
        const payload = req.body;

        // update the customer
        updateCustomer( id, payload );

        // send status code with the updated customer
        res.status( 201 ).json( {
            message: "Customer has been updated!"
        } );
    }

    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error un the server",
            cause: error.message
        } );
    }
} );

// delete a customer 
router.delete( "/:id", async ( req, res ) =>
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
        res.status( 500 ).json( {
            errorMessage: "There was an error un the server",
            cause: error.message
        } );
    }
} );


module.exports = router;
