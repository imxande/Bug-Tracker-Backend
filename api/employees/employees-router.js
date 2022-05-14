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

/******************************************************************************************
 *********************************END POINTS*************************************************
 **************************************👇****************************************************/

// get all employees
router.get( "/", restricted, adminAccess, async ( req, res ) =>
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
        res.status( 500 ).json( {
            errorMessage: "There was an error in the server",
            cause: error.message,
        } );
    }
} );

// get specific employee by its id
router.get( "/:id", restricted, adminAccess, async ( req, res ) =>
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
        res.status( 500 ).json( {
            errorMessage: "There was an error in the server",
            cause: error.message,
        } );
    }
} );

// create an employee
router.post( "/", restricted, adminAccess, async ( req, res ) =>
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
        res.status( 500 ).json( {
            errorMessage: "There was an error in the server",
            cause: error.message,
        } );
    }
} );

// update employee
router.put( "/:id", restricted, adminAccess, async ( req, res ) =>
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
        res.status( 500 ).json( {
            errorMessage: "There was an error in the server",
            cause: error.message,
        } );
    }
} );

// delete an employee
router.delete( "/:id", restricted, adminAccess, async ( req, res ) =>
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
        res.status( 500 ).json( {
            errorMessage: "There was an error in the server",
            cause: error.message,
        } );
    }
} );

module.exports = router;
