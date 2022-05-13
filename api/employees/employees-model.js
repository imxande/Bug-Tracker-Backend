// import our database configuration 
const db = require( "../../data/config/dbConfig" );

// get all employees from the data base
const getAllEmployees = () =>
{
    // return all employees
    return db( "employees" );
};

// get employee
const getEmployee = ( username ) =>
{
    // get the employee
    return db( "employees" ).where( "email", username ).first();
};

// find employee by id
const getEmployeeById = ( id ) =>
{
    // find employee by its id and send it back
    return db( "employees" ).where( "employee_id", id ).first();
};

// get employee by email
const getEmployeeByEmail = async ( email ) =>
{
    // find email and grab the password 
    const { password } = await db( "employees" ).where( "email", email ).select( "password" ).first(); // again adding first here because if not added we get an array of object 

    // return the password
    return password;
};

// create a new employee in the data base
const createEmployee = async ( employee ) =>
{
    //  grab the id after employee has been added to the database
    const [ id ] = await db( "employees" ).insert( employee );

    // find newly create employee from the data base
    const newEmployee = await getEmployeeById( id );

    //  return new employee
    return newEmployee;
};

// update employee
const updateEmployee = async ( id, changes ) =>
{
    // find employee, update it with the changes
    return db( "employees" ).where( "employee_id", id ).update( changes );
};

//  delete employee
const deleteEmployee = async ( id ) =>
{
    //  find employee to be deleted
    const employee = await getEmployeeById( id );

    // delete employee 
    await db( "employees" ).where( "employee_id", id ).del();

    // send the deleted employee back
    return employee;
};

module.exports = {
    getAllEmployees,
    getEmployee,
    getEmployeeById,
    getEmployeeByEmail,
    createEmployee,
    updateEmployee,
    deleteEmployee
};