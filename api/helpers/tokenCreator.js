// import json web token 
const jsonWebToken = require( "jsonwebtoken" );

// import dot env library
require( "dotenv" ).config();

// toke creator method
const tokenCreator = ( customer ) =>
{
    // create payload
    const payload = {
        subject: customer.customer_id,
        name: `${ customer.firstName } ${ customer.lastName }`,
        role: customer.role
    };

    // options
    const options = {
        expiresIn: "1d"
    };

    // grab secret from Environment Variable
    const secret = process.env.TOKEN_SECRET;

    return jsonWebToken.sign( payload, secret, options );
};


module.exports = tokenCreator;
