// import bcrypt
// const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import customer validation
const { validateFirstName, validateLastName } = require( "../auth/auth-middleware" );

// register endpoint and handler
router.post( "/register", validateFirstName, validateLastName, ( req, res, next ) =>
{
    res.send( "Register is good to go" );
} );

module.exports = router;
