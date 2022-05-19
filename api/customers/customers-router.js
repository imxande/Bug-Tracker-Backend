// imports 
const router = require( "express" ).Router();
const { findAll, findById, updateCustomer, deleteCustomer } = require( "../customers/customers-model" );
const { restricted, adminAccess } = require( "../auth/auth-middleware" );


/**
 * @api {get} /api/customers List all customers
 * @apiVersion 1.0.0
 * @apiName GetCustomers
 * @apiGroup Customers
 * 
 * @apiHeader {String} jsonwebtoken Employees unique access token
 * @apiHeaderExample {json} Request-Example:              
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 * 
 * @apiSuccess {Object[]} customers List of all customers
 * @apiSuccess {Number} customer_id Customer ID 
 * @apiSuccess {String} firstname Customer Firstname
 * @apiSuccess {String} lastname Customer Lastname 
 * @apiSuccess {String} email Customer email 
 * @apiSuccess {String} password Customer Password 
 * @apiSuccess {String} role Customer Role 
 * 
 * @apiSuccessExample {Object[]}  Success-Response:
 * HTTP/1.1 200 OK
 *      [
 *          {
 *              "customer_id": 1,
 *              "firstName": "Lorenzo",
 *              "lastName": "Duplo",
 *              "email": "duplo@test.tst",
 *              "password": "this has to be a hash",
 *              "role": "user"
 *          },
 *          {
 *              "customer_id": 2,
 *              "firstName": "Freddie",
 *              "lastName": "Maco",
 *              "email": "freddie@test.tst",
 *              "password": "$2b$10$Z34VNxFTv6WToPrnpqMn3uZa9oC7b/U1gR//UxQV6D.TJrKburmEe",
 *              "role": "user"
 *          },
 *     ]
 * 
 * @apiError {Registration-Error} {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 * 
 * @apiError {Registration-Error} {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 * 
 * @apiError {Registration-Error} {String} Forbidden Not administrator
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
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
