// import email validator module
const validator = require( "email-validator" );
const { findBy } = require( "../customers/customers-model" );

// method to check if first name is between max and min length limits
const validateFirstName = ( req, res, next ) =>
{

    // we will get the first name from the body of the request
    const { firstName } = req.body;

    // now we need to check if there was not first name in the body of the request
    if ( !firstName )
    {
        // send status code BAD REQUEST with an error message
        res.status( 400 ).json( {
            errorMessage: "Not content, first name is empty please provide first name"
        } );
    }
    // in case first name is too short or too long
    else if ( firstName.length < 2 || firstName.length > 64 )
    {
        // send status code BAD REQUEST with an error message
        res.status( 400 ).json( {
            errorMessage: "First name exceeds min or max length, make sure that first name length is greater than 2 and less than 64"
        } );
    }
    // otherwise
    else
    {
        // terminate current middleware jump to the next middleware
        next();
    }

};

// method to check if last name is between max and min length limits
const validateLastName = ( req, res, next ) =>
{
    // grab last name from request body
    const { lastName } = req.body;

    // check if last name is empty 
    if ( !lastName )
    {
        // send status code BAD REQUEST with error message
        res.status( 400 ).json( {
            errorMessage: "Error, last name not added, please make sure to add last name"
        } );
    }
    // in case last name exceeds min or max length limit
    else if ( lastName.length < 2 || lastName.length > 64 )
    {
        // send status code BAD REQUEST with error message
        res.status( 400 ).json( {
            errorMessage: "Error, last name exceeds min or max length, make sure the last name length is greater than 2 and less than 64"
        } );
    }
    // wrap everything up and call next middleware
    else
    {
        next();
    }
};

// method to check if email between max and min length limits will use an email validator npm module for better validation
const validateEmail = ( req, res, next ) =>
{
    // grab email from request body
    const { email } = req.body;

    // store email validation
    const isValid = validator.validate( email );

    // check if email is empty
    if ( !email )
    {
        // send status code BAD REQUEST with error message
        res.status( 400 ).json( {
            errorMessage: "Error, email is empty please send email address"
        } );
    }
    //  check if email already exist in the data base

    // we will us email validator npm module to validate our email, can't reinvent the wheel yet
    else if ( isValid === false )
    {
        res.status( 400 ).json( {
            errorMessage: "Error, please make sure you use the correct format for email"
        } );
    }
    // wrap everything up and call next middleware
    else
    {
        next();
    }



};

// checking if the password is good to go, I will be using a library here as well
const validatePassword = ( req, res, next ) =>
{
    // grab password from body of request
    const { password } = req.body;

    // check if password is empty
    if ( !password )
    {
        res.status( 400 ).json( {
            errorMessage: "Error, password is empty, please make sure to provide a password in the request"
        } );
    }

    // check for the password length
    else if ( password.length > 255 || password.length < 4 )
    {
        res.status( 400 ).json( {
            errorMessage: "Please make sure the length of the password is at least 4 characters and less than 255 "
        } );
    }

    // otherwise call next middleware 
    else
    {
        next();
    }
};

// check if credentials are valid
const validateCredentials = async ( req, res, next ) =>
{
    // grab credentials
    const credentials = req.body;

    // check if customer exist in the data base
    const { email, password } = credentials;

    // find email on data base
    const storedHash = await findBy( email );

    // check if store hash was returned
    if ( storedHash )
    {
        // compare passwords
        res.send( storedHash );
    }

    // in case there is not return stored hash
    else if ( !storedHash )
    {
        res.status( 400 ).json( {
            errorMessage: "Error, username or password incorrect"
        } );
    }


    else
    {
        next();
    }

};

// // check if customer already exist | we will check with email
// const checkCustomerExist = (req, res, next) => {

// }

// // restricted access to registered customers only
// const restricted = (req, res, next) => {

// }



// export middleware
module.exports = {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateCredentials
}; 