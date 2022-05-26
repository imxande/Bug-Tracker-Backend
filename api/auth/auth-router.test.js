// imports
const db = require("../../data/config/dbConfig");
const app = require("../app");
const request = require("supertest");

/**
 * Our registration end point has a bunch of validators middleware that will validate the payload object
 * I have added this simple validatePayload function here in order to use supertest to send a malformed payload object
 * to trigger our validator middleware. Our payload will send missing information. For example when we don't add an email
 * the validateEmail should be triggered as supertest gets hit with the request with the missing property. Another example could be
 * that our payload is missing the role or the new user. Well our role validator middleware should be triggered, and so on.
 *
 * Please check our auth middleware for a full list of the validators we have created.
 *
 */
const validatePayload = (payload) => {
	const response = request(app).post("/api/auth/register").send(payload);
	return response;
};

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

describe("testing environment", () => {
	test("is the correct environment to run our test", () => {
		expect(process.env.DB_ENV).toBe("testing");
	});
});

describe("[POST] /api/auth/register Created ", () => {
	const payload = {
		firstName: "Firstname",
		lastName: "Lastname",
		email: "customer@test.tst",
		password: "password",
		role: "user",
	};
	it("responds with status code 201", async () => {
		const response = await validatePayload(payload);
		expect(response.status).toBe(201);
	});
});

describe("[POST] /api/auth/register firstname less than 2 characters limit ", () => {
	const payload = {
		firstName: "F",
		lastName: "Lastname",
		email: "customer@test.tst",
		password: "password",
		role: "user",
	};
	it("responds with status code 400", async () => {
		const response = await validatePayload(payload);
		expect(response.status).toBe(400);
	});
});
describe("[POST] /api/auth/register firstname less than 2 characters limit error message", () => {
	const payload = {
		firstName: "F",
		lastName: "Lastname",
		email: "customer@test.tst",
		password: "password",
		role: "user",
	};
	it("should respond with error message", async () => {
		const response = await validatePayload(payload);
		const expectedResponse =
			"First name exceeds min or max length, make sure that firstname length is greater than 2 and less than 64";
		expect(response.body.errorMessage).toBe(expectedResponse);
	});
});

describe("[POST] /api/auth/register firstname more than 64 characters limit error message", () => {
	const payload = {
		firstName:
			"Pablodiegojoséfranciscodepaulajuannepomucenomaríadelosremediosciprianodelasantísimatrinidad",
		lastName: "Lastname",
		email: "customer@test.tst",
		password: "password",
		role: "user",
	};
	it("should respond with status 400", async () => {
		const response = await validatePayload(payload);

		expect(response.status).toBe(400);
	});
});
describe("[POST] /api/auth/register firstname more than 64 characters limit error message", () => {
	const payload = {
		firstName:
			"Pablodiegojoséfranciscodepaulajuannepomucenomaríadelosremediosciprianodelasantísimatrinidad",
		lastName: "Lastname",
		email: "customer@test.tst",
		password: "password",
		role: "user",
	};
	it("should respond with error message", async () => {
		const response = await validatePayload(payload);
		const expectedResponse =
			"First name exceeds min or max length, make sure that firstname length is greater than 2 and less than 64";
		expect(response.body.errorMessage).toBe(expectedResponse);
	});
});
describe("[POST] /api/auth/register no email ", () => {
	it("responds 400 if no email in payload", async () => {
		const response = await validatePayload({
			customer_id: 5,
			firstName: "Sy",
			lastName: "Bnd",
			password: "pass",
			role: "user",
		});
		expect(response.status).toBe(400);
	});
});
describe("[POST] /api/auth/register no role", () => {
	it("responds 400 if no role in payload", async () => {
		const response = await validatePayload({
			customer_id: 5,
			firstName: "Sy",
			lastName: "Bnd",
			email: "sy@test.tst",
			password: "pass",
		});
		expect(response.status).toBe(400);
	});
});

describe("[POST] /api/auth/register no password", () => {
	it("responds 400 if no password in payload", async () => {
		const response = await validatePayload({
			customer_id: 5,
			firstName: "Syd",
			lastName: "Bndd",
			email: "sy@test.tdst",
			role: "user",
		});
		expect(response.status).toBe(400);
	});
});
describe("[POST] /api/auth/register missing password", () => {
	it("responds error message if no password in payload", async () => {
		const response = await validatePayload({
			customer_id: 5,
			firstName: "Sfy",
			lastName: "Bndg",
			email: "sy@tedgst.tst",
			role: "user",
		});

		expect(response.body.errorMessage).toBe(
			"Error, password is empty, please make sure to provide a password in the request"
		);
	});
});
