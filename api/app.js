// imports
const express = require( "express" );
const cors = require( "cors" );
const morgan = require( "cors" );
const helmet = require( "cors" );
const globalErrorHandler = require( "./helpers/globalErrorHandler" );
const path = require( "path" );
const apidoc = path.join( __dirname, "../apidoc" );
const authRouter = require( "./auth/auth-router" );
const customersRouter = require( "./customers/customers-router" );
const ticketsRouter = require( "./tickets/tickets-router" );
const employeesRouter = require( "./employees/employees-router" );

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

// routes
app.use( "/api/auth", authRouter );
app.use( "/api/customers", customersRouter );
app.use( "/api/tickets", ticketsRouter );
app.use( "/api/employees", employeesRouter );
app.use( globalErrorHandler ); // global error handler
app.use( "/documentation", express.static( apidoc ) ); // add documentation to our application

// initial endpoint
app.get( "/", ( req, res ) =>
{
	// send some message
	res.send( "Hello from bug-tracker server!" );
} );

// exports
module.exports = app;
