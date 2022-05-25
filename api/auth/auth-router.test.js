// imports
const db = require("../../data/config/dbConfig");
const app = require("../app");
const request = require("supertest");

// supertest request
const postRequestRegister = request(app).post("/api/auth/register");

// run migrations before each test
beforeAll(async () => {
	// roll back first
	await db.migrate.rollback();
	// run latest migrations
	await db.migrate.latest();
});

// lets run all our seeds before each test
beforeEach(async () => {
	await db.seed.run();
});

// lest disconnect from the data base after all the test are done.
afterAll(async () => {
	await db.destroy();
});

describe("environment", () => {
	test("is the correct environment to run our test", () => {
		expect(process.env.DB_ENV).toBe("testing");
	});
});

describe("[POST] /api/auth/register ", () => {
	it("responds 400 if no email in payload", async () => {
		let res = await postRequestRegister.send({
			customer_id: 5,
			firstName: "Sy",
			lastName: "Bnd",
			password: "pass",
			role: "user",
		});
		expect(res.status).toBe(400);
	});
	it("responds 400 if no role in payload", async () => {
		const res = await postRequestRegister.send({
			customer_id: 5,
			firstName: "Sy",
			lastName: "Bnd",
			email: "sy@test.tst",
			password: "pass",
		});
		expect(res.status).toBe(400);
	});
	it("responds 400 if no password in payload", async () => {
		const res = await postRequestRegister.send({
			customer_id: 5,
			firstName: "Syd",
			lastName: "Bndd",
			email: "sy@test.tdst",
			role: "user",
		});
		expect(res.status).toBe(400);
	});
	it("responds error message if no password in payload", async () => {
		const res = await postRequestRegister.send({
			customer_id: 5,
			firstName: "Sfy",
			lastName: "Bndg",
			email: "sy@tedgst.tst",
			role: "user",
		});

		const email = res.email;
		console.log(email);
		const error = res.body.errorMessage;
		console.log(error);

		expect(res.body.errorMessage).toBe(
			"Error, password is empty, please make sure to provide a password in the request"
		);
	});
});
