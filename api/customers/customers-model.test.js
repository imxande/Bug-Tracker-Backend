// imports
const db = require("../../data/config/dbConfig");
const customersModel = require("./customers-model");
require("dotenv").config();
const hashPassword = require("../helpers/hashPassword");
const { type } = require("express/lib/response");

// run migrations
beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});

// seed my table
beforeEach(async () => {
	await db.seed.run();
});

// disconnect from database
afterAll(async () => {
	await db.destroy();
});

describe("Customers database access functions", () => {
	describe("Get all the customers with findAll method", () => {
		it("Resolves to all customers in the customers table", async () => {
			const customers = await customersModel.findAll();
			expect(customers.length).toBe(4);
		});
	});

	describe("Get customer by email with findCustomer method", () => {
		it("should return the customer", async () => {
			const email = "abigayle@test.test";
			const customer = await customersModel.findCustomer(email);
			const expectedCustomer = {
				customer_id: 4,
				firstName: "Abigayle",
				lastName: "Janine",
				email: "abigayle@test.test",
				password: expect.any(String),
				role: "regular user",
			};

			expect(customer).toMatchObject(expectedCustomer);
		});
	});

	describe("Find customer by id with findById method", () => {
		it("should return the specified customer", async () => {
			const id = 1;
			const customer = await customersModel.findById(id);
			const expectedCustomer = {
				customer_id: 1,
				firstName: "Zavier",
				lastName: "Yolanda",
				email: "zavier@test.test",
				password: expect.any(String),
				role: "regular user",
			};

			expect(customer).toMatchObject(expectedCustomer);
		});
	});

	describe("Find customer by email with findByEmail method", () => {
		it("should return customer password", async () => {
			const filter = "abigayle@test.test";
			const password = await customersModel.findByEmail(filter);
			const expectedHash = expect.any(String);

			expect(password).toEqual(expectedHash);
		});
	});
});
