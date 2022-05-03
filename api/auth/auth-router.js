// import bcrypt
// const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import customer validation
const { validateFirstName, validateLastName, validateEmail, validatePassword } = require( "../auth/auth-middleware" );

/* 
*********************************END POINTS 👇**********************************************
*/

//**************************** REGISTER endpoint and handler ****************************
router.post( "/register", validateFirstName, validateLastName, validateEmail, validatePassword, ( req, res ) =>
{
    res.send( "Register is good to go" );
} );

module.exports = router;
