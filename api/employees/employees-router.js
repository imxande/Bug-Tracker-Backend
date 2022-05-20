// imports
const router = require("express").Router();
const { restricted, adminAccess } = require("../auth/auth-middleware");
// prettier-ignore
const {	createEmployee,	getAllEmployees, getEmployeeById, updateEmployee,deleteEmployee} = require("../employees/employees-model");

/**
 * @api {get} /api/employees List all Employees
 * @apiVersion 1.0.0
 * @apiName GetEmployees
 * @apiGroup Employees
 *
 * @apiHeader {String} jsonwebtoken Employees unique access token
 * @apiHeaderExample {json} Header-Example:
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiSuccess {Object[]} Employees List of all Employees
 * @apiSuccess {Number} employee_id Employee ID
 * @apiSuccess {String} firstname Employee Firstname
 * @apiSuccess {String} lastname Employee Lastname
 * @apiSuccess {String} email Employee email
 * @apiSuccess {String} password Employee Password
 * @apiSuccess {String} role Employee Role
 *
 * @apiSuccessExample {Object[]}  Success-Response:
 * HTTP/1.1 200 OK
 *      [
 *          {
 *              "employee_id": 1,
 *              "firstName": "Lorenzo",
 *              "lastName": "Duplo",
 *              "email": "duplo@test.tst",
 *              "password": "asgjsadgasjdg",
 *              "role": "user"
 *          },
 *          {
 *              "employee_id": 2,
 *              "firstName": "Freddie",
 *              "lastName": "Maco",
 *              "email": "freddie@test.tst",
 *              "password": "$2b$10$Z34VNxFTv6WToPrnpqMn3uZa9oC7b/U1gR//UxQV6D.TJrKburmEe",
 *              "role": "user"
 *          },
 *     ]
 *
 * @apiError (Employees-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 *
 * @apiError (Employees-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 *
 * @apiError (Employees-Error) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
router.get("/", restricted, adminAccess, async (req, res, next) => {
	try {
		// grab all employees from data base
		const employees = await getAllEmployees();

		// return all the employees
		res.status(200).json(employees);
	} catch (error) {
		// send error to client
		next({ error });
	}
});

/**
 * @api {get} /api/employees/:id Employees unique id
 * @apiName GetEmployee
 * @apiVersion 1.0.0
 * @apiGroup Employee
 *
 * @apiHeader {String} jsonwebtoken Admin unique access token
 * @apiHeaderExample {json} Header-Example:
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiSuccess {json} Employee Information
 * @apiSuccess {Number} employee_id ID
 * @apiSuccess {String} firstName Employee Firstname
 * @apiSuccess {String} lastName Employee Lastname
 * @apiSuccess {String} email Employee Email
 * @apiSuccess {String} password Employee Password
 * @apiSuccess {String} role Employee Role
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 *      {
 *          "employee_id": 1,
 *          "firstName": "Suzi",
 *          "lastName": "Load",
 *          "email": "suzi@test.tst",
 *          "password": "$2b$10$TA.fITJQ4gfT4w6HQizbrORraKBn9lWO5FInKUpr712bFko4ZY5/i",
 *          "role": "user"
 *      }
 *
 * @apiError (Employee-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 *
 * @apiError (Employee-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied"
 *
 * @apiError (Employee-Error) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
router.get("/:id", restricted, adminAccess, async (req, res, next) => {
	try {
		// grab id from parameter
		const { id } = req.params;

		// find employee by id
		const employee = await getEmployeeById(id);

		// send status with the employee
		res.status(200).json(employee);
	} catch (error) {
		// send error to client
		next({ error });
	}
});

/**
 * @api {post} /api/employees/:id Create new employee
 * @apiVersion 1.0.0
 * @apiName CreateEmployee
 * @apiGroup Employee
 *
 * @apiParam {String} firstname Employee Firstname
 * @apiParam {String} lastname Employee Lastname
 * @apiParam {String} email Employee Email
 * @apiParam {String} password Employee Password
 * @apiParam {String} role Employee User Role
 *
 * @apiParamExample {json} Input Request Example:
 *    {
 *     "firstName": "Firstname",
 *     "lastName": "Lastname",
 *     "email": "unique@test.tst",
 *     "password": "password",
 *     "role": "admin"
 *    }
 *
 *
 * @apiSuccessExample {json} Success Response Output:
 *  HTTP/1.1 201 Created
 *
 *    {
 *      "employee_id": 20
 *      "firstName": "Firstname",
 *      "lastName": "Lastname",
 *      "email": "unique@test.tst",
 *      "password": "$$2b$10$hVDly.4Mlfpu2tSVjZtnbu7nUsxWLnDT8Qr8JgFxhH5WGPSj6LVLG",
 *      "role": "admin"
 *    }
 *
 * @apiError (Employee-Error) {String}  BadRequest The entered email already has an associated account.
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      "Email provided is already associated with an account"
 *
 * @apiError (Employee-Error) {json} BadRequest Firstname param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *          "errorMessage": "Not content, firstname is empty please provide first name"
 *      }
 *
 * @apiError (Employee-Error) {json} BadRequest Lastname param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, lastname not added, please make sure to add last name"
 *      }
 *
 * @apiError (Employee-Error) {json} BadRequest Email param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, email is empty please send email address"
 *      }
 *
 * @apiError (Employee-Error) {json} BadRequest Password param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, password not provided, please create a password"
 *      }
 *
 * @apiError (Employee-Error) {json} BadRequest Password param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, password not provided, please create a password"
 *      }
 *
 * @apiError (Employee-Error) {json} Bad Request Role param empty.
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 400 Bad Request
 *      {
 *         "errorMessage": "Error, role not provided, please make sure to include a role"
 *      }
 */
router.post("/", restricted, adminAccess, async (req, res, next) => {
	try {
		// grab employee's info from request body
		const employee = req.body;

		// add employee to data base using create employee method from employee's model
		const newEmployee = await createEmployee(employee);

		// send status and the new employee in the response
		res.status(201).json(newEmployee);
	} catch (error) {
		// send error to client
		next({ error });
	}
});

/**
 * @api {put} /api/employee/:id Edit Employee
 * @apiName EditEmployee
 * @apiGroup Employee
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} jsonwebtoken Employee unique access token
 * @apiHeaderExample {json} Header-Example:
 * * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiParam {json} payload Payload should be an object with the changes
 * @apiDescription Edit customer description
 * To edit an employee make sure to send in the header the jsonwebtoken
 * The body of the request should include at least a change to make to the employee
 *
 * @apiParamExample {json} Input Request body:
 *      {
 *          firstName: "Change",
 *          lastName: "Change",
 *      }
 *
 * @apiSuccess {json} employee Updated Employee Object
 * @apiSuccess {json} message Message
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 Ok
 *      {
 *         {
 *          "employee_id": 9,
 *          "firstName": "Changed FirstName",
 *          "lastName": "LastName",
 *          "email": "unique@test.tst",
 *          "password": "$2b$10$NJxZd38RiKpbyjYmNz6FJueqTN/9UQ7/r7XfnLwDnYFwbKp3EfP6.",
 *          "role": "admin"
 *         },
 *         "message": "Employee has been updated!"
 *      }
 *
 *
 * @apiBody {json} jsonwebtoken JWT Mandatory json web token
 * @apiBody {json} payload Mandatory changes to make at least 1 change
 *
 * @apiError (Customer-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 *
 * @apiError (Customer-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied"
 *
 * @apiError (Customer-Error) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 *
 * */
router.put("/:id", restricted, adminAccess, async (req, res, next) => {
	try {
		// grab id from parameters
		const { id } = req.params;

		// grab changes from request body
		const changes = req.body;

		// update employee with changes
		await updateEmployee(id, changes);

		//  find employee
		const employee = await getEmployeeById(id);

		// send status and the updated employee
		res.status(200).json({
			...employee,
			message: "Employee has been updated",
		});
	} catch (error) {
		// send error to client
		next({ error });
	}
});

/**
 * @api {delete} /api/employees/:id Delete an employee
 * @apiName DeleteEmployee
 * @apiGroup Employee
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} jsonwebtoken Admin unique access token
 * @apiHeaderExample {json} Header-Example:
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 *      {
 *          "employee_id": 9,
 *          "firstName": "Firstname",
 *          "lastName": "Lastname",
 *          "email": "unique@test.tst",
 *          "password": "$2b$10$NJxZd38RiKpbyjYmNz6FJueqTN/9UQ7/r7XfnLwDnYFwbKp3EfP6.",
 *          "role": "admin"
 *      }
 *
 * @apiError (Employee-Error) {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 *
 * @apiError (Employee-Error) {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 *
 * @apiError (Employee-Error) {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 *
 */
router.delete("/:id", restricted, adminAccess, async (req, res, next) => {
	try {
		// grab id from params
		const { id } = req.params;

		// grab deleted employee
		const employee = await deleteEmployee(id);

		// return status and the deleted employee
		res.status(200).json(employee);
	} catch (error) {
		// send error to client
		next({ error });
	}
});

module.exports = router;
