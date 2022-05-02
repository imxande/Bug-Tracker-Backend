// customer validation method
const customerValidation = ( customer ) =>
{
    // error object
    const error = {};

    // grab all info from customer object
    const { firstName, lastName, email, password } = customer;

    // check if there is not first name
    if ( !firstName )
    {
        // check if there is not last name
        error[ "message" ] = "Error, first name is empty, please add your first name";
    }
    // check if there is not last name
    else if ( !lastName )
    {
        // add message to our error object
        error[ "message" ] = "Error, last name not added, please write your last name";
    }
    // check if there is not email address
    else if ( !email )
    {
        // add message to our error object
        error[ "message" ] = "Error, email not provided, please provide a valid email";
    }
    // check if there is not password
    else if ( !password )
    {
        // add message to our error object
        error[ "message" ] = "Error, there was not password entered, please make sure to create a password";
    }
    // check for maximum characters limit
    else if ( firstName.length > 64 || lastName.length > 64 || email.length > 64 )
    {
        error[ "message" ] = "Error, please make sure firstname, lastname or email doesn't exceed the maximum character limit";
    }
    // check for minimum characters limit
    else if ( firstName.length < 2 || lastName.length < 2 || email.length < 2 )
    {
        error[ "message" ] = "Error, please make sure firstname, lastname or email doesn't exceed the minimum character limit";
    }

    return {
        //  send an object wether the validation is successful or not and the error object
        isSuccessful: !error.message ? true : false,
        error,
    };
};

// export the customer validation method
module.exports = customerValidation;
