/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// import dotenv library
require("dotenv").config();

// import hashing method
const hashPassword = require("../../api/helpers/hashPassword");

exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex("employees").del();
	await knex("employees").insert([
		{
			employee_id: 1,
			firstName: "Lucy",
			lastName: "Adams",
			email: process.env.EMPLOYEE_EMAIL,
			password: hashPassword(process.env.EMPLOYEE_PASSWORD),
			role: "admin",
		},
	]);
};
