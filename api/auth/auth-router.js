// import bcrypt
// const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import customer validation
const { validateFirstName } = require( "../auth/auth-middleware" );

// register endpoint and handler
router.post( "/register", validateFirstName, ( req, res, next ) =>
{
    res.send( "Register is good to go" );
} );

module.exports = router;
