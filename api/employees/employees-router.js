// import express and create a router
const router = require( "express" ).Router();

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all employees 
router.get( "/", ( req, res ) =>
{
    res.send( "Get all employees wired!" );
} );

module.exports = router;