// import bcrypt
// const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import customer validation
const { validateFirstName, validateLastName, validateEmail } = require( "../auth/auth-middleware" );

/* 
*********************************END POINTS 👇**********************************************
*/

//**************************** REGISTER endpoint and handler ****************************
router.post( "/register", validateFirstName, validateLastName, validateEmail, ( req, res ) =>
{
    console.log( req.body );
    res.send( "Register is good to go" );
} );

module.exports = router;
