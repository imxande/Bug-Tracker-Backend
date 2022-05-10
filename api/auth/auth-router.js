// import bcrypt
const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import json web token
// const jsonWebToken = require( "jsonwebtoken" );

// import customer validation
const { validateFirstName, validateLastName, validatePassword, validateCredentials } = require( "../auth/auth-middleware" );

// import customer model 
const { add, findCustomer } = require( "../customers/customers-model" );

// import token creator helper method
const tokenCreator = require( "../helpers/tokenCreator" );



/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

//**************************** REGISTER endpoint and handler ****************************
router.post( "/register", validateFirstName, validateLastName, validatePassword, async ( req, res ) =>
{
    try
    {
        // grab customer (Object) info from request body
        const customer = req.body;

        // salt rounds for our hash
        const saltRounds = 10;

        // hash password
        const hash = bcrypt.hashSync( customer.password, saltRounds );

        // overwrite plain text password with our the hash 
        customer.password = hash;

        // Send customer info to the database and store the return value we get from adding customer into the data base
        const newCustomer = await add( customer );
        // send response to the client with the newly created customer
        res.status( 201 ).json( newCustomer );

    }

    // in case of error send status and error message
    catch ( error )
    {
        res.status( 500 ).json( {
            errorMessage: "There was an error on the server",
            cause: error.message // send the specific error that caused the crash
        } );
    }
} );

//**************************** LOGIN endpoint and handler ****************************
router.post( "/login", validateCredentials, async ( req, res ) =>
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
        res.status( 500 ).json( {
            errorMessage: "There was an error on the server",
            cause: error.message
        } );
    }
} );

module.exports = router;
