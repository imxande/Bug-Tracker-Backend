// import bcrypt
const bcrypt = require( "bcrypt" );

// import express and create a router
const router = require( "express" ).Router();

// import customer validation
const { validateFirstName, validateLastName, validateEmail, validatePassword } = require( "../auth/auth-middleware" );

// import customer model 
const Customers = require( "../customers/customers-model" );

/* 
*********************************END POINTS 👇**********************************************
*/

//**************************** REGISTER endpoint and handler ****************************
router.post( "/register", validateFirstName, validateLastName, validateEmail, validatePassword, async ( req, res, next ) =>
{
    try
    {
        // grab customer info from request body
        const customer = req.body;


        // salt rounds for our hash
        const saltRounds = 10;

        // hash password
        const hash = bcrypt.hashSync( customer.password, saltRounds );

        // assign the hash to customer password
        customer.password = hash;

        // Send customer info to the database and store the return value we get from adding customer into the data base
        //     const response = await Customers.add(customer).then(saved => {

        //     })

        //     } 

        //     catch(error) {
        //         res.status(500).json(error.message)
        //     }





        // } );

        module.exports = router;
