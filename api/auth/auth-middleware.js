// imports
const validator = require( "email-validator" );
const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
const { findByEmail, findCustomer } = require( "../customers/customers-model" );
const { getEmployeeByEmail, getEmployee } = require( "../employees/employees-model" );
const { getTicketById } = require( "../tickets/tickets-model" );
require( "dotenv" ).config();

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
            errorMessage:
                "Not content, first name is empty please provide first name",
        } );
    }
    // in case first name is too short or too long
    else if ( firstName.length < 2 || firstName.length > 64 )
    {
        // send status code BAD REQUEST with an error message
        res.status( 400 ).json( {
            errorMessage:
                "First name exceeds min or max length, make sure that first name length is greater than 2 and less than 64",
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
            errorMessage:
                "Error, last name not added, please make sure to add last name",
        } );
    }
    // in case last name exceeds min or max length limit
    else if ( lastName.length < 2 || lastName.length > 64 )
    {
        // send status code BAD REQUEST with error message
        res.status( 400 ).json( {
            errorMessage:
                "Error, last name exceeds min or max length, make sure the last name length is greater than 2 and less than 64",
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
            errorMessage: "Error, email is empty please send email address",
        } );
    }

    // we will us email validator npm module to validate our email, can't reinvent the wheel yet
    else if ( isValid === false )
    {
        res.status( 400 ).json( {
            errorMessage:
                "Error, please make sure you use the correct format for email",
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
            errorMessage:
                "Error, password is empty, please make sure to provide a password in the request",
        } );
    }

    // check for the password length
    else if ( password.length > 255 || password.length < 4 )
    {
        res.status( 400 ).json( {
            errorMessage:
                "Please make sure the length of the password is at least 4 characters and less than 255 ",
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
    const { email, password, role } = credentials;

    // in case payload is empty
    if ( !email || !password )
    {
        // send status code BAD REQUEST and error message
        res.status( 400 ).json( {
            errorMessage:
                "Username or Password missing, please make sure to add username and password",
        } );
    }

    // find email on data base (findByEmail method returns an object with the stored hash)
    const storedHash = role !== "admin" ? await findByEmail( email ) : await getEmployeeByEmail( email );

    // check if store hash was returned
    if ( storedHash )
    {
        // compare passwords
        const isValid = bcrypt.compareSync( password, storedHash );

        if ( !isValid )
        {
            res.status( 401 ).json( {
                errorMessage: "Invalid credentials",
            } );
        } else
        {
            next();
        }
    }

    // in case there is not return stored hash
    else if ( !storedHash )
    {
        res.status( 400 ).json( {
            errorMessage: "Error, username or password incorrect",
        } );
    }

    // otherwise wrap everything and call next middleware
    else
    {
        next();
    }
};

// check if user exist in data base
const validateExistence = async ( req, res, next ) =>
{
    // grab email from request body
    const { email } = req.body;

    //  find customer or employee with that email
    const user = await findCustomer( email ) || await getEmployee( email );

    // check if there was not user found
    if ( !user )
    {
        // send a code status NOT FOUND with error message
        res.status( 404 ).json( "User was not found, please register" );
    }
    // otherwise 
    else
    {
        // wrap everything up and call next middleware
        next();
    }
};

// restricted middleware will enforce restricted access to resources only if customer or employee is authorized. 
const restricted = ( req, res, next ) =>
{
    // grab token in header authorization from request. Note that authorization is one of the properties on the request headers. 
    const token = req.headers.authorization;

    // grab our secret from our environment variables
    const secret = process.env.TOKEN_SECRET;

    // in case we dont have a token send status code with error message
    if ( !token )
    {
        // send status code FORBIDDEN and message
        res.status( 403 ).json( "Permission denied, not token found" );
    }

    // verify the token using the token, the secret and a call back to handle the error or success. This is async.
    jwt.verify( token, secret, ( error, decoded ) =>
    {
        //  check if there is an error
        if ( error )
        {
            // send status code with error message. Note that an error object contains properties name, message and stack and more - please use debugger to check them out
            res.status( 401 ).json( {
                message: error.message,
            } );
        }
        // otherwise we will decode the token and add it to the request
        else
        {
            // add decoded token to the request decodedJWT property in order to have access to the entire payload. Note: We will need the role to check for admin access.
            req.decodedJWT = decoded;
            // wrap everything and call next middleware
            next();
        }
    } );
};

// access only to employees
const adminAccess = ( req, res, next ) =>
{
    // grab the user role from the request
    const { role } = req.decodedJWT;

    // if role is not admin send error message else wrap everything up and call next middleware
    role !== "admin" ? res.status( 403 ).json( "Permission denied, not an admin user" ) : next();

};

/** Access to ticket by a customer owner of the ticket or an admin 
 * - The idea here is that only admins and the owner of the ticket have access to the ticket
 * - If the owner of the ticket is not the same user making the request we will deny access
 * - If user is not admin we will deny access
*/
const ticketAccess = async ( req, res, next ) =>
{
    /** Scenario 1 a user is trying to access specific ticket by id. 
     * - We will need to find the user trying to request access to the ticket
     * - 1- We do this by finding the user id from the decoded token
     * - We need to check if the user requesting this info is the owner of the ticket
     * - 1- Every ticket has an owner represented by the a customer_id 
     * - 2- We will need to find the ticket first
     * - 3- Then we need to find the owner in the ticket at the customer_id property in the ticket object 
     * - Scenario 2 an admin user want access to a ticket
     * - 1- We will grant permission to access 
    */
    const user_id = req.decodedJWT.subject; // grab the id of the user making the request 
    const ticket_id = req.params.id; // grab ticket id from request params
    const ticket = await getTicketById( ticket_id ); // find the ticket by its id
    const owner_id = ticket.customer_id; // grab the id of the ticket owner
    const { role } = req.decodedJWT; // grab the role from decoded JWT in the request

    // check if user is admin
    if ( role === "admin" )
    {
        // wrap everything up and call next middleware
        next();
    }

    // otherwise check for permissions
    else
    {
        // Check if the user requesting to view the ticket is not the same as the ticket owner 
        user_id !== owner_id ? res.status( 403 ).json( "Permission denied, not the owner of the ticket" ) : next();

    }
};

// export middleware
module.exports = {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateCredentials,
    validateExistence,
    restricted,
    adminAccess,
    ticketAccess
};
