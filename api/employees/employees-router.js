// import express and create a router
const router = require( "express" ).Router();
const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require( "../employees/employees-model" );
const { restricted, adminAccess } = require( "../auth/auth-middleware" );

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
 * @apiError {EmployeesError} {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not token found"
 * 
 * @apiError {EmployeesError} {json} Unauthorized Not authorized
 * @apiErrorExample {json} Error-Response:
 *      HTTP 1.1 401 Unauthorized
 *      {
 *           message: "JWT malformed"
 *      }
 * 
 * @apiError {EmployeesError} {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP 1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
router.get( "/", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // grab all employees from data base
        const employees = await getAllEmployees();

        // return all the employees
        res.status( 200 ).json( employees );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

/**
 * @api {get} /api/employees/:id Employees unique id
 * @apiName GetEmployee
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} jsonwebtoken Admin unique access token
 * @apiHeaderExample {json} Header-Example: 
 * { "Authorization": "aklsdfuhajwejn;aglkasgjasoidgasf##$$sjfaisdfoi"}
 * 
 * @apiSuccess {Object{}} Employee Information
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
 * @apiError {EmployeeError} {json} Unauthorized Not authorized
 * @apiErrorExample {json} 401 Unauthorized
 *      {
 *          "message": "JWT malformed"
 *      }
 * 
 * @apiError {EmployeeError} {String} Forbidden Not authorized
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission Denied"
 * 
 * @apiError {EmployeeError} {String} Forbidden Not administrator
 * @apiErrorExample {String} Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      "Permission denied, not an admin user"
 */
router.get( "/:id", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // grab id from parameter
        const { id } = req.params;

        // find employee by id
        const employee = await getEmployeeById( id );

        // send status with the employee
        res.status( 200 ).json( employee );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// create an employee
router.post( "/", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // grab employee's info from request body
        const employee = req.body;

        // add employee to data base using create employee method from employee's model
        const newEmployee = await createEmployee( employee );

        // send status and the new employee in the response
        res.status( 201 ).json( newEmployee );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// update employee
router.put( "/:id", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // grab id from parameters
        const { id } = req.params;

        // grab changes from request body
        const changes = req.body;

        // update employee with changes
        await updateEmployee( id, changes );

        //  find employee
        const employee = await getEmployeeById( id );

        // send status and the updated employee
        res.status( 200 ).json( employee );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

// delete an employee
router.delete( "/:id", restricted, adminAccess, async ( req, res, next ) =>
{
    try
    {
        // grab id from params
        const { id } = req.params;

        // grab deleted employee
        const employee = await deleteEmployee( id );

        // return status and the deleted employee
        res.status( 200 ).json( employee );
    }

    catch ( error )
    {
        // send error to client
        next( { error } );
    }
} );

module.exports = router;
