// imports
const express = require( "express" );
const cors = require( "cors" );
const morgan = require( "cors" );
const helmet = require( "cors" );
const authRouter = require( "./auth/auth-router" );
const customersRouter = require( "./customers/customers-router" );
const ticketsRouter = require( "./tickets/tickets-router" );

// create express app
const app = express();

// adding helmet for layer of security
app.use( helmet() );

// adding morgan to log http request
app.use( morgan() );

// enhancing cross-origin resource sharing
app.use( cors() );

// Parsing incoming requests with JSON payloads
app.use( express.json() );

// endpoint for registration
app.use( "/api/auth", authRouter );
app.use( "/api/customers", customersRouter );
app.use( "/api/tickets", ticketsRouter );

// Initial request
app.get( "/", ( req, res ) =>
{
  // send some message
  res.json( { message: "Hello from bug-tracker server!" } );
} );

// exports
module.exports = app;
