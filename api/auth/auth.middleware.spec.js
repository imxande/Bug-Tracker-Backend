const { validateFirstName } = require("./auth-middleware");

describe("environment", () => {
	test("is the correct environment to run our test", () => {
		expect(process.env.DB_ENV).toBe("testing");
	});
});

describe("validateFirstName", () => {
	test("checks if there is a firstname in the request body", () => {});
});
