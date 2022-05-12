// import express and create a router
const router = require( "express" ).Router();
const { createEmployee, getAllEmployees } = require( "../employees/employees-model" );

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all employees 
router.get( "/", async ( req, res ) =>
{
    // grab all employees from data base
    const employees = await getAllEmployees();

    // return all the employees
    res.status( 200 ).json( employees );
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
            cause: error.message
        } );
    }
} );

module.exports = router;