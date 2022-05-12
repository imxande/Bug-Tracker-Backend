// import our database configuration 
const db = require( "../../data/config/dbConfig" );

// find employee by id
const getEmployeeById = ( id ) =>
{
    return db( "employees" ).where( "employee_id", id ).first();
};
// create a new employee in the data base
const createEmployee = async ( employee ) =>
{
    const [ id ] = await db( "employees" ).insert( employee );

    // find newly create employee from the data base
    const newEmployee = await getEmployeeById( id );

    //  return new employee
    return newEmployee;
};

module.exports = {
    createEmployee,
    getEmployeeById
};