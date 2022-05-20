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
 * @apiHeaderExample {json} Header-Example:              
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
 *              "password": "afdfasdfasfasdfasdfsadfasdf,
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
 * @apiError (CustomersError) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 * 
 * @apiError (CustomersError) {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 * 
 * @apiError (CustomersError) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
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

/**
 * @api {get} /api/customers/:id Customers unique id
 * @apiName GetCustomer
 * @apiVersion 1.0.0
 * @apiGroup Customer
 * 
 * @apiHeader {String} jsonwebtoken Admin unique access token
 * @apiHeaderExample {json} Header-Example: 
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 * 
 * @apiSuccess {Object{}} Customer Information
 * @apiSuccess {Number} customer_id ID
 * @apiSuccess {String} firstName Customer Firstname
 * @apiSuccess {String} lastName Customer Lastname
 * @apiSuccess {String} email Customer Email
 * @apiSuccess {String} password Customer Password
 * @apiSuccess {String} role Customer Role
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 *      {
 *          "customer_id": 1,
 *          "firstName": "Suzi",
 *          "lastName": "Load",
 *          "email": "suzi@test.tst",
 *          "password": "$2b$10$TA.fITJQ4gfT4w6HQizbrORraKBn9lWO5FInKUpr712bFko4ZY5/i",
 *          "role": "user"
 *      }
 * 
 * @apiError {CustomerError} {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 * 
 * @apiError {CustomerError} {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied, not token found"
 * 
 * @apiError {CustomerError} {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
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

/**
 * @api {put} /api/customers/:id Edit Customer
 * @apiName EditCustomer
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} jsonwebtoken Employee unique access token
 * @apiHeaderExample {json} Header-Example:
 * * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 * 
 * @apiParam {json} payload Payload should be an object with the changes
 * @apiDescription Edit customer description
 * To edit a customer make sure to send in the header the jsonwebtoken
 * The body of the request should include at least a change to make to the customer
 * 
 * @apiParamExample {json} Input Request body:
 *      {
 *          firstName: [The changed firstname],
 *          lastName: [The changed lastname],         
 *      }
 * 
 * @apiSuccess {json} message Message
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 Ok
 *      {
 *          "message": "Customer has been updated!"
 *      }
 * 
 * 
 * @apiBody {json} jsonwebtoken JWT Mandatory json web token
 * @apiBody {json} payload Mandatory changes to make at least 1 change
 * 
 * @apiError {CustomerError} {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 * 
 * @apiError {CustomerError} {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied, not token found"
 * 
 * @apiError {CustomerError} {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 * 
 * */
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

/**
 * @api {delete} /api/customers/:id Delete a customer
 * @apiName DeleteCustomer
 * @apiGroup Customer
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} jsonwebtoken Admin unique access token
 * @apiHeaderExample {json} Header-Example: 
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 *      {
 *          "customer_id": 9,
 *          "firstName": "Syas",
 *          "lastName": "Bnd",
 *          "email": "syasdsds@test.tst",
 *          "password": "$2b$10$NJxZd38RiKpbyjYmNz6FJueqTN/9UQ7/r7XfnLwDnYFwbKp3EfP6.",
 *          "role": "user"
 *      }
 * 
 * @apiError (CustomersError) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 * 
 * @apiError (CustomersError) {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 * 
 * @apiError (CustomersError) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 * 
 */
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
