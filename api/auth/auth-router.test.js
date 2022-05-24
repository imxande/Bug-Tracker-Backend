// imports
const db = require("../../data/config/dbConfig");
const app = require("../app");
const request = require("supertest");

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
		const res = await request(app).post("/api/auth/register").send({
			customer_id: 5,
			firstName: "Sy",
			lastName: "Bnd",
			password: "pass",
			role: "user",
		});
		expect(res.status).toBe(400);
	});
	it("response with a json error message if email in payload already in use", async () => {
		const res = await request(app).post("/api/auth/register").send({
			customer_id: 5,
			firstName: "Sy",
			lastName: "Bnd",
			email: "sy@test.tst",
			password: "pass",
			role: "user",
		});
		expect(res.json).toBe("Email provided is already associated with an account");
	});
});
