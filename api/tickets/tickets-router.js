// import express and create router
const router = require( "express" ).Router();

// imports from tickets model
// prettier-ignore
const { createTicket, getAllTickets, getCustomerTickets, getTicketById, updateTicket, deleteTicket } = require( "./tickets-model" );

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
 * @apiError (Tickets-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 *
 * @apiError (Tickets-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 *
 * @apiError (Tickets-Error) {String} Forbidden Not administrator
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
	} catch ( error )
	{
		// send error to client
		next( { error } );
	}
} );

/**
 * @api {get} /api/tickets/:id Get a ticket
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
 * @apiSuccess {json} ticket Ticket Information
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
 * @apiError (Tickets-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 *
 * @apiError (Tickets-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied, not token found"
 *
 * @apiError (Tickets-Error) {String} Forbidden Not administrator
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
	} catch ( error )
	{
		// send error to client
		next( { error } );
	}
} );

// get all ticket that belong to specific customer
router.get( "/customer/:id", async ( req, res, next ) =>
{
	try
	{
		// grab it form params
		const { id } = req.params;

		// find all tickets related to customer
		const customerTickets = await getCustomerTickets( id );

		// send response with tickets
		res.status( 200 ).json( customerTickets );
	} catch ( error )
	{
		// send error
		next( { error } );
	}
} );

/**
 * @api {post} /api/tickets/ Create a ticket
 * @apiName CreateTicket
 * @apiVersion 1.0.0
 * @apiGroup Ticket
 *
 * @apiHeader {String} jsonwebtoken Customer or Admin unique token
 * @apiHeaderExample {json} Header-Example:
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiParam {json} payload Payload of a ticket information
 * @apiParamExample {json} Parameters:
 * {
 * 	 	"customer_id": "1",
 *   	"subject": "More test",
 *   	"date": "November 11th 2022",
 *   	"status": "new",
 *   	"body": "testing testing testing",
 *   	"employee_id": null
 * 	
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 *          {
 *              "message": "A new ticket with id: 8 was created!",
 *          }
 *
 * @apiError (Tickets-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "Invalid Token"
 *      }
 *
 * @apiError (Tickets-Error) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
router.post( "/", restricted, async ( req, res, next ) =>
{
	try
	{
		// grab ticket info from request body
		const ticket = req.body;

		// automate low priority if priority property empty
		const { priority } = ticket;
		const lowPriority = "Low";


	if (priority === "") {
		ticket.priority = lowPriority;
	}

		// add ticket to the database
		const [ id ] = await createTicket( ticket );

		// send status code with id of the ticket created
		res.status( 201 ).json( {
			message: `A new ticket with id: ${ id } was created!`,
		} );
	} catch ( error )
	{
		// send error to client
		next( { error } );
	}
} );

/**
 * @api {put} /api/tickets/:id Edit Ticket
 * @apiName EditTicket
 * @apiGroup Ticket
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} jsonwebtoken Customer Owner or Employee unique access token
 * @apiHeaderExample {json} Header-Example:
 * * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiParam {json} payload Payload should be an object with the changes
 * @apiDescription Edit customer description
 * To edit a ticket make sure to send in the header the jsonwebtoken
 * The body of the request should include at least a change to make to the customer
 * Only the ticket's customer/owner or an employee admin can edit a ticket
 *
 * @apiParamExample {json} Input Request body:
 *      {
 *          "subject": "New Subject...",
 *          "body": "New body...",
 *      }
 *
 * @apiSuccess {json} message Message
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 Ok
 *      {
 *          "ticket_id": 6,
 *          "customer_id": 1,
 *          "employee_id": null,
 *          "subject": "New subject changes..."",
 *          "date": "November 5th 2022",
 *          "status": "new",
 *          "body": "New body changes..."
 *      }
 *
 *
 * @apiBody {json} jsonwebtoken JWT Mandatory json web token
 * @apiBody {json} payload Mandatory changes to make at least 1 change
 *
 * @apiError (Ticket-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 *
 * @apiError (Ticket-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied"
 *
 * @apiError (Ticket-Error) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 *
 * */
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
	} catch ( error )
	{
		// send error to client
		next( { error } );
	}
} );

/**
 * @api {delete} /api/tickets/:id Delete a ticket
 * @apiName DeleteTicket
 * @apiGroup Ticket
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} jsonwebtoken Admin or Customer-Owner unique access token
 * @apiHeaderExample {json} Header-Example:
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 *       {
 *           "deleted": {
 *           "ticket_id": 7,
 *           "customer_id": 1,
 *           "employee_id": null,
 *           "subject": "More test",
 *           "date": "November 11th 2022",
 *           "status": "new",
 *           "body": "testing testing testing"
 *           },
 *           "message": "Ticket with id 7 has been deleted"
 *       }
 *
 * @apiError (Ticket-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 *
 * @apiError (Ticket-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 *
 * @apiError (Ticket-Error) {String} Forbidden Not Owner
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not the owner of the ticket"
 */
router.delete( "/:id", restricted, ticketAccess, async ( req, res, next ) =>
{
	try
	{
		// grab id from request parameters
		const { id } = req.params;

		// find and delete the ticket
		const deletedTicket = await deleteTicket( id );

		// send message and status
		res.status( 200 ).json( {
			deleted: deletedTicket,
			message: `Ticket with id ${ id } has been deleted`,
		} );
	} catch ( error )
	{
		// send error to client
		next( { error } );
	}
} );

/**
 * @api {patch} /api/tickets/:id Assign Ticket to employee
 * @apiName AssignTicket
 * @apiGroup Ticket
 * @apiVersion 1.0.0
 *
 * @apiDescription Assign ticket description
 * To assign a ticket to an employee make sure to send in the request body the employee id
 *
 * @apiParam {json} payload Payload should be an object with employee id
 * @apiParam {Number} id Employee ID
 * @apiParamExample {json} Input Request-Example:
 *      {
 *          "employee_id": 2
 *      }
 *
 * @apiHeader {String} jsonwebtoken Employee admin unique access token
 * @apiHeaderExample {json} Header-Example:
 * * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiSuccess {json} message Message
 * @apiSuccess {json} ticket Ticket update with new assigned employee
 *
 * @apiSuccessExample
 * HTTP/1.1 Ok
 *      {
 *          "message": "The ticket has been assigned with a new employee, Freddie Maco will be taking care of the ticket with the id of 8",
 *          "ticket": {
 *                      "ticket_id": 8,
 *                      "customer_id": 1,
 *                      "employee_id": 2,
 *                      "subject": "More test",
 *                      "date": "November 11th 2022",
 *                      "status": "new",
 *                      "body": "testing testing testing"
 *                      }
 *      }
 *
 * @apiError (Ticket-Error) {String}  TicketNotFound Ticket not found
 * @apiErrorExample {String} Error-Response:
 * HTTP/1.1 404  Not Found
 * "Ticket with id of 81 does not exist!"
 *
 * @apiError (Ticket-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied, not token found"
 *
 * @apiError (Ticket-Error) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
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
			ticket: assignedTicket,
		} );
	} catch ( error )
	{
		// send error to client
		next( { error } );
	}
} );

module.exports = router;
