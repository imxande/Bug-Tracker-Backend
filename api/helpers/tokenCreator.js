// import json web token 
const jsonWebToken = require( "jsonwebtoken" );

// import dot env library
require( "dotenv" ).config();

// display name method
const displayName = ( firstname, lastname ) =>
{
    // add first name and last name 
    const name = `${ firstname } ${ lastname }`;

    return name;
};

// toke creator method
const tokenCreator = ( customer ) =>
{
    // create payload
    const payload = {
        subject: customer.customer_id,
        name: displayName( customer.firstName, customer.lastName )
    };

    // options
    const options = {
        expiresIn: "1d"
    };

    const secret = process.env.TOKEN_SECRET;

    return jsonWebToken.sign( payload, secret, options );
};


module.exports = tokenCreator;
