// import bcrypt
const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import customer validation
const { validateEmail, userEmailCheck, validateFirstName, validateLastName, validatePassword, validateCredentials, validateExistence, validateRole } = require( "../auth/auth-middleware" );

//  model imports 
const { add, findCustomer } = require( "../customers/customers-model" );
const { createEmployee, getEmployee } = require( "../employees/employees-model" );

// import token creator helper method
const tokenCreator = require( "../helpers/tokenCreator" );

/**
 * @api {post} /api/auth/register Register new user
 * @apiVersion 1.0.0
 * @apiName Register Customer
 * @apiGroup Auth
 * @apiParam {Object{}} user User's Info
 * @apiParam {String} firstname Customer Firstname
 * @apiParam {String} lastname Customer Lastname
 * @apiParam {String} email Customer Email
 * @apiParam {String} password Customer Password
 * @apiParam {String} role Customer User Role
 * 
 * @apiParamExample {json} Input Request Example:
 *    {
 *     "firstName": "Firstname",
 *     "lastName": "Lastname",
 *     "email": "customer@test.tst",
 *     "password": "password",
 *     "role": "user"
 *    }
 * 
 * 
 * @apiSuccessExample {json} Success Response Output:
 *  HTTP/1.1 201 Created
 * 
 *    {
 *     "customer_id": 7,
 *     "firstName": "Sony",
 *     "lastName": "Bland",
 *     "email": "sony@test.tst",
 *     "password": "$$2b$10$hVDly.4Mlfpu2tSVjZtnbu7nUsxWLnDT8Qr8JgFxhH5WGPSj6LVLG",
 *     "role": "user"
 *    }
 * 
 * @apiError {Registration-Error} {String} Status: 400 The entered email already has an associated account.
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      "Email provided is already associated with an account"
 * 
 * @apiError {Registration-Error} {json} Status: 400 Bad Request Firstname param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *          "errorMessage": "Not content, firstname is empty please provide first name"
 *      }
 * 
 * @apiError {Registration-Error} {json} Status: 400 Bad Request Lastname param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, lastname not added, please make sure to add last name"
 *      }
 * 
 * @apiError {Registration-Error} {json} Status: 400 Bad Request Email param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, email is empty please send email address"
 *      }
 * 
 * @apiError {Registration-Error} {json} Status: 400 Bad Request Password param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, password not provided, please create a password"
 *      }
 * 
 * @apiError {Registration-Error} {json} Status: 400 Bad Request Password param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, password not provided, please create a password"
 *      }
 * 
 * @apiError {Registration-Error} {json} Status: 400 Bad Request Role param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, role not provided, please make sure to include a role"
 *      }
 */
router.post( "/register", validateEmail, userEmailCheck, validateRole, validateFirstName, validateLastName, validatePassword, async ( req, res, next ) =>
{
    try
    {
        // grab a user (Object) info from request body
        const user = req.body;

        // salt rounds for our hash
        const saltRounds = 10;

        // hash password
        const hash = bcrypt.hashSync( user.password, saltRounds );

        // overwrite plain text password with our the hash 
        user.password = hash;

        // Send user info to the database and store the return value we get from adding user into the data base
        const newUser = user.role !== "admin" ? await add( user ) : await createEmployee( user );
        // send response to the client with the newly created customer
        res.status( 201 ).json( newUser );

    }

    // in case of error send status and error message
    catch ( error )
    {
        next( error );
    }
} );

//**************************** LOGIN endpoint and handler ****************************
router.post( "/customers/login", validateExistence, validateCredentials, async ( req, res, next ) =>
{
    try
    {
        //  grab customer information from request body
        const { email } = req.body;

        // find customer info in data base
        const customer = await findCustomer( email );

        // build a token
        const newToken = tokenCreator( customer );

        // send status code SUCCESS and token to the client 
        res.status( 200 ).json( {
            message: `Welcome back ${ customer.firstName }`,
            token: newToken
        } );

    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

//**************************** EMPLOYEE ADMIN LOGIN ****************************
router.post( "/employees/login", validateExistence, validateCredentials, async ( req, res, next ) =>
{
    try
    {
        //  grab customer information from request body
        const { email } = req.body;

        // get password
        const employee = await getEmployee( email );

        // build a token
        const newToken = tokenCreator( employee );

        // send status code SUCCESS and token to the client 
        res.status( 200 ).json( {
            message: `Welcome back ${ employee.firstName }`,
            token: newToken
        } );

    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

module.exports = router;
