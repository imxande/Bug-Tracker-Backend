// import express and create a router
const router = require( "express" ).Router();
const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
} = require( "../employees/employees-model" );

/******************************************************************************************
 *********************************END POINTS*************************************************
 **************************************👇****************************************************/

// get all employees
router.get( "/", async ( req, res ) =>
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
router.get( "/:id", async ( req, res ) =>
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
router.post( "/", async ( req, res ) =>
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
router.put( "/:id", async ( req, res ) =>
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
} );

module.exports = router;
