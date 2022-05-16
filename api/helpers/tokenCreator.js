// import json web token 
const jsonWebToken = require( "jsonwebtoken" );

// import dot env library
require( "dotenv" ).config();

// token creator method
const tokenCreator = ( user ) =>
{
    // create payload
    const payload = {
        subject: user.customer_id || user.employee_id,
        name: `${ user.firstName } ${ user.lastName }`,
        role: user.role
    };

    // options
    const options = {
        expiresIn: "1d"
    };

    // grab secret from Environment Variable
    const secret = process.env.TOKEN_SECRET;

    // create the token
    return jsonWebToken.sign( payload, secret, options );
};


module.exports = tokenCreator;
