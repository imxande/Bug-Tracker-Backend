// Checking if we are testing in the TESTING environment
describe("environment", () => {
	test("is the testing environment", () => {
		expect(process.env.DB_ENV).toBe("testing");
	});
});
