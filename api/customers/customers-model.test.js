// imports
const db = require("../../data/config/dbConfig");
const customersModel = require("./customers-model");

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
		it("Resolves to all customers in the customer table", async () => {
			const customers = await customersModel.findAll();
			expect(customers.length).toBe(4);
		});
	});
});
