// import bcrypt
const bcrypt = require("bcrypt");

// import express and create a router
const router = require("express").Router();

// import customer validation
const {
	validateEmail,
	userEmailCheck,
	validateFirstName,
	validateLastName,
	validatePassword,
	validateCredentials,
	validateExistence,
	validateRole,
} = require("../auth/auth-middleware");

//  model imports
const { add, findCustomer } = require("../customers/customers-model");
const { createEmployee, getEmployee } = require("../employees/employees-model");

// import token creator helper method
const tokenCreator = require("../helpers/tokenCreator");

/**
 * @api {post} /api/auth/register Register new user
 * @apiVersion 1.0.0
 * @apiName RegisterCustomer
 * @apiGroup Auth
 *
 * @apiParam {String} firstname Customer Firstname
 * @apiParam {String} lastname Customer Lastname
 * @apiParam {String} email Customer Email
 * @apiParam {String} password Customer Password
 * @apiParam {String} role Customer User Role
 *
 * @apiParamExample {json} Input Request Example:
 *    {
 *     "firstName": "Firstname",
 *     "lastName": "Lastname",
 *     "email": "customer@test.tst",
 *     "password": "password",
 *     "role": "user"
 *    }
 *
 *
 * @apiSuccessExample {json} Success Response Output:
 *  HTTP/1.1 201 Created
 *
 *    {
 *     "firstName": "Firstname",
 *     "lastName": "Lastname",
 *     "email": "customer@test.tst",
 *     "password": "$$2b$10$hVDly.4Mlfpu2tSVjZtnbu7nUsxWLnDT8Qr8JgFxhH5WGPSj6LVLG",
 *     "role": "user"
 *    }
 *
 * @apiError (Auth-Error) {String} BadRequest The entered email already has an associated account.
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      "Email provided is already associated with an account"
 *
 * @apiError (Auth-Error) {json} BadRequest Email format.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, please make sure you use the correct format for email",
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Firstname param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *          "errorMessage": "Not content, firstname is empty please provide first name"
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Firstname exceeds limit.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *          "errorMessage": "First name exceeds min or max length, make sure that first name length is greater than 2 and less than 64"
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Lastname param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, lastname not added, please make sure to add last name"
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Lastname exceeds limit.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *          "errorMessage": "Lastname exceeds min or max length, make sure that lastname length is greater than 2 and less than 64"
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Email param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, email is empty please send email address"
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Password param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *        "errorMessage": "Error, password is empty, please make sure to provide a password in the request"
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Password exceeds limit.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Please make sure the length of the password is at least 4 characters and less than 255"
 *      }
 *
 * @apiError (Auth-Error) {json} BadRequest Role param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, role not provided, please make sure to include a role"
 *      }
 *
 */
// prettier-ignore
router.post("/register", validateEmail, userEmailCheck, validateRole, validateFirstName, validateLastName, validatePassword, async (req, res, next) => {
		try {
			// grab a user (Object) info from request body
			const user = req.body;

			// salt rounds for our hash
			const saltRounds = 10;

			// hash password
			const hash = bcrypt.hashSync(user.password, saltRounds);

			// overwrite plain text password with our the hash
			user.password = hash;

			// Send user info to the database and store the return value we get from adding user into the data base
			const newUser = user.role !== "admin" ? await add(user) : await createEmployee(user);
			// send response to the client with the newly created customer
			res.status(201).json(newUser);
		} catch (error) {
			// in case of error send status and error message
			next(error);
		}
	}
);

/**
 * @api {post} /api/auth/customers/login Customer Login
 * @apiVersion 1.0.0
 * @apiName CustomerLogin
 * @apiGroup Auth
 *
 * @apiParam {String} email Customer email
 * @apiParam {String} password Customer password
 *
 * @apiParamExample {json} Input Request Example:
 *  {
 *      "email": "suzi@test.tst,
 *      "password":"pass"
 *  }
 *
 * @apiSuccess {String} message Welcome message
 * @apiSuccess {String} token Authorization token
 *
 * @apiSuccessExample {json} Success Response Output:
 * HTTP/1.1 200 Success
 *   {
 *       "message": "Welcome back Suzi",
 *       "token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJuYW1lIjoiU3V6aSBMb2FkIiwicm9sZSI6I"
 *   }
 *
 * @apiError (Auth-Error) {String} UserNotFound User not found
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 404 Not Found
 *      "User was not found, please register"
 *
 * @apiError (Auth-Error) {json} BadRequest Missing params
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Not Found
 *      {
 *           errorMessage: "Username or Password missing, please make sure to add username and password"
 *      }
 */
router.post("/customers/login", validateExistence, validateCredentials, async (req, res, next) => {
	try {
		//  grab customer information from request body
		const { email } = req.body;

		// find customer info in data base
		const customer = await findCustomer(email);

		// build a token
		const newToken = tokenCreator(customer);

		// send status code SUCCESS and token to the client
		res.status(200).json({
			message: `Welcome back ${customer.firstName}`,
			token: newToken,
		});
	} catch (error) {
		// send error to client
		next({ error });
	}
});

/**
 * @api {post} /api/auth/employees/login Employee Login
 * @apiVersion 1.0.0
 * @apiName EmployeeLogin
 * @apiGroup Auth
 *
 * @apiParam {String} email Employee email
 * @apiParam {String} password Employee password
 * @apiParam {String} role Employee role
 *
 * @apiParamExample {json} Input Request Example:
 *  {
 *      "email": "freddie@test.tst",
 *      "password": "pass",
 *      "role": "admin"
 *  }
 *
 * @apiSuccess {String} message Welcome message
 * @apiSuccess {String} token Authorization token
 *
 * @apiSuccessExample {json} Success Response Output:
 * HTTP/1.1 200 Success
 *   {
 *       "message": "Welcome back Freddie",
 *       "token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJuYW1lIjoiU3V6aSBMb2FkIiwicm9sZSI6I"
 *   }
 *
 * @apiError (Auth-Error) {String} UserNotFound User not found
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 404 Not Found
 *      "User was not found, please register"
 *
 * @apiError (Auth-Error) {json} BadRequest Missing Params
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *           errorMessage: "Username or Password missing, please make sure to add username and password"
 *      }
 */
router.post("/employees/login", validateExistence, validateCredentials, async (req, res, next) => {
	try {
		//  grab customer information from request body
		const { email } = req.body;

		// get password
		const employee = await getEmployee(email);

		// build a token
		const newToken = tokenCreator(employee);

		// send status code SUCCESS and token to the client
		res.status(200).json({
			message: `Welcome back ${employee.firstName}`,
			token: newToken,
		});
	} catch (error) {
		// send error to client
		next({ error });
	}
});

module.exports = router;
