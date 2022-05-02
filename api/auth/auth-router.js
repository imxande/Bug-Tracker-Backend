// import bcrypt
const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import customer validation
const customerValidation = require( "../customers/customerValidation" );

// register endpoint and handler
router.post( "/register", ( req, res ) =>
{
    // store request body
    const customer = req.body;

    // validate that the body of request contains the related info needed to create a new customer
    const validated = customerValidation( customer );

    // if customer data from request body is good then create customer in data in data base and send back the newly created customer
    if ( validated.isSuccessful )
    {
        // if info is good to go let us hash the password
        const saltRounds = 10;
        const { password } = customer;

        bcrypt.hash( password, saltRounds, ( err, hash ) =>
        {
            res.send( hash );
        } );
    }
    // if not we will need to send an error message base on what went wrong and how to fix it
    else
    {
        res.send( validated.error );
    }
} );

module.exports = router;
