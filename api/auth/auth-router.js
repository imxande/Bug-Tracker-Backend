// import bcrypt
const bcrypt = require( "bcrypt" );

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
    // grab customer info from request body
    const { fistName, lastName, email, password } = req.body;

    // salt rounds for our hash
    const saltRounds = 10;

    // hash password
    bcrypt.hash( password, saltRounds, ( err, hash ) =>
    {
        // store hash in data base
        res.send( hash );
    } );



} );

module.exports = router;
