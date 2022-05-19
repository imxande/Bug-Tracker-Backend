// import express and create router
const router = require( "express" ).Router();

// imports from tickets model
const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require( "./tickets-model" );

// import auth middleware
const { restricted, adminAccess, ticketAccess } = require( "../auth/auth-middleware" );

// import employees middleware
const { getEmployeeById } = require( "../employees/employees-model" );

// import ticket middleware
const ticketPresence = require( "./ticket-middleware" );


/**
 * @api {get} /api/tickets List all tickets
 * @apiVersion 1.0.0
 * @apiName GetTickets
 * @apiGroup Tickets
 * 
 * @apiHeader {String} jsonwebtoken Employees unique access token
 * @apiHeaderExample {json} Header-Example:              
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 * 
 * @apiSuccess {Object[]} tickets List of all tickets
 * @apiSuccess {Number} ticket_id Ticket ID 
 * @apiSuccess {Number} customer_id Customer Owner ID 
 * @apiSuccess {Number} employee_id Employee Assigned ID 
 * @apiSuccess {String} subject Ticket Subject
 * @apiSuccess {String} date Ticket Date  
 * @apiSuccess {String} status Ticket Status 
 * @apiSuccess {String} body Ticket Body 
 * 
 * @apiSuccessExample {Object[]}  Success-Response:
 * HTTP/1.1 200 OK
 *      [
 *          {
 *              "ticket_id": 6,
 *              "customer_id": 1,
 *              "employee_id": 1,
 *              "subject": "java update",
 *              "date": "November 5th 2022",
 *              "status": "new",
 *              "body": "System requires a java update"
 *          },
 *          {
 *              "ticket_id": 7,
 *              "customer_id": 1,
 *              "employee_id": null,
 *              "subject": "More test",
 *              "date": "November 12th 2022",
 *              "status": "new",
 *              "body": "testing testing testing"
 *          }
 *     ]
 * 
 * @apiError {TicketsError} {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 * 
 * @apiError {TicketsError} {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 * 
 * @apiError {TicketsError} {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
router.get( "/", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // get all the tickets from the data base
        const tickets = await getAllTickets();

        // send status code and all the tickets in the response 
        res.status( 200 ).json( tickets );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

/**
 * @api {get} /api/tickets/:id Users unique id
 * @apiName GetTicket
 * @apiVersion 1.0.0
 * @apiGroup Ticket
 * @apiDescription Get a ticket by id 
 * A ticket can be checked by the owner/customer of the ticket and an employee with admin access
 * 
 * @apiHeader {String} jsonwebtoken Customer Owner or Admin unique access token
 * @apiHeaderExample {json} Header-Example: 
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 * 
 * @apiSuccess {Object{}} ticket Ticket Information
 * @apiSuccess {Number} ticket_id Ticket ID 
 * @apiSuccess {Number} customer_id Customer Owner ID 
 * @apiSuccess {Number} employee_id Employee Assigned ID 
 * @apiSuccess {String} subject Ticket Subject
 * @apiSuccess {String} date Ticket Date  
 * @apiSuccess {String} status Ticket Status 
 * @apiSuccess {String} body Ticket Body 
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 *          {
 *              "ticket_id": 6,
 *              "customer_id": 1,
 *              "employee_id": 1,
 *              "subject": "java update",
 *              "date": "November 5th 2022",
 *              "status": "new",
 *              "body": "System requires a java update"
 *          }
 * 
 * @apiError {CustomerError} {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 * 
 * @apiError {CustomerError} {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied"
 * 
 * @apiError {CustomerError} {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
router.get( "/:id", restricted, ticketAccess, async ( req, res, next ) =>
{
    try
    {
        // grab id from request params
        const { id } = req.params;

        // find ticket by id
        const ticket = await getTicketById( id );

        // send status with the ticket
        res.status( 200 ).json( ticket );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// create a ticket
router.post( "/", restricted, async ( req, res, next ) =>
{
    try
    {
        // grab ticket info from request body
        const ticket = req.body;

        // add ticket to the database
        const [ id ] = await createTicket( ticket );

        // send status code with id of the ticket created
        res.status( 201 ).json( {
            message: `A new ticket with id: ${ id } was created!`
        } );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// edit a ticket
router.put( "/:id", restricted, ticketAccess, async ( req, res, next ) =>
{
    try
    {
        // grab id from params 
        const { id } = req.params;

        // grab changes from the request body
        const changes = req.body;

        // create a new ticket with the changes
        const updatedTicket = await updateTicket( id, changes );

        // send status code with message
        res.status( 200 ).json( updatedTicket );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// delete a ticket
router.delete( "/:id", restricted, ticketAccess, ( req, res, next ) =>
{
    try
    {
        // grab id from request parameters
        const { id } = req.params;

        // find and delete the ticket
        const deletedTicket = deleteTicket( id );

        // send message and status
        res.status( 200 ).json( {
            deleted: deletedTicket,
            message: `Ticket with id ${ id } has been deleted`
        } );

    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// assign an employee to work on the ticket
router.patch( "/:id", ticketPresence, restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // grab the id from request params
        const { id } = req.params;

        // get the assigned employee from the body of the request 
        const assign = req.body;

        // assign employee to ticket
        const assignedTicket = await updateTicket( id, assign );

        // find employee assigned
        const employeeAssigned = await getEmployeeById( assign.employee_id );

        // find employee name
        const name = `${ employeeAssigned.firstName } ${ employeeAssigned.lastName }`;

        // send status code with success message
        res.status( 200 ).json( {
            message: `The ticket has been assigned with a new employee, ${ name } will be taking care of the ticket with the id of ${ id }`,
            ticket: assignedTicket
        } );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }


} );

// assign a ticket
module.exports = router;