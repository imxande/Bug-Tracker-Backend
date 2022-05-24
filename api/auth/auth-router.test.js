// imports
const db = require("../../data/config/dbConfig");
const app = require("../app");
const request = require("supertest");
console.log(process.env.DB_ENV);

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
		let res = await request(app).post("/api/auth/register").send({});
		expect(res.status).toBe(400);
	});
});
