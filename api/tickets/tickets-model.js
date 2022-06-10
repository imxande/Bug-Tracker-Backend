// import knex config
const db = require("../../data/config/dbConfig");

// get all tickets method
const getAllTickets = () => {
	return db("tickets");
};

// get ticket by id
const getTicketById = async (id) => {
	// from the tickets table find the ticket column with the id specified and return it
	return db("tickets").where("ticket_id", id).first(); // if first not pass we will receive an array
};

// create a ticket
const createTicket = async (ticket) => {
	// from the tickets column insert the ticket object
	return db("tickets").insert(ticket);
};

// update ticket
const updateTicket = async (id, changes) => {
	// find ticket and update
	await db("tickets").where("ticket_id", id).update(changes);

	// find ticket
	const ticket = await getTicketById(id);

	// return ticket
	return ticket;
};

// delete ticket
const deleteTicket = async (id) => {
	// find ticket by id
	const ticket = await getTicketById(id);

	// delete ticket
	await db("tickets").where("ticket_id", id).del();

	// return ticket
	return ticket;
};

// get customer tickets
const getCustomerTickets = async (id) => {
	const tickets = await db("tickets").where("customer_id", id);
	console.log(tickets);

	return tickets;
};

module.exports = {
	getAllTickets,
	getTicketById,
	createTicket,
	updateTicket,
	deleteTicket,
	getCustomerTickets,
};
