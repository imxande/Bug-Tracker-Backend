/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//  lets get the date
const dateTime = new Date();

exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex("tickets").del();
	await knex("tickets").insert([
		{
			customer_id: "1",
			subject: "A test",
			date: dateTime.toLocaleDateString("en-US"),
			status: "Open",
			body: "testing testing testing",
			employee_id: null,
		},
		{
			customer_id: "1",
			subject: "Open test",
			date: dateTime.toLocaleDateString("en-US"),
			status: "Open",
			body: "testing testing testing",
			employee_id: null,
		},
		{
			customer_id: "1",
			subject: "More test",
			date: dateTime.toLocaleDateString("en-US"),
			status: "Open",
			body: "testing testing testing",
			employee_id: null,
		},
		{
			customer_id: "1",
			subject: "Another test",
			date: dateTime.toLocaleDateString("en-US"),
			status: "Open",
			body: "testing testing testing",
			employee_id: null,
		},
		{
			customer_id: "1",
			subject: "Ok last test",
			date: dateTime.toLocaleDateString("en-US"),
			status: "Open",
			body: "testing testing testing",
			employee_id: null,
		},
	]);
};
