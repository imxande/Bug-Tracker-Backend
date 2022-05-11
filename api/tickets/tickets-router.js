// import express and create router
const router = require( "express" ).Router();

/****************************************************************************************** 
*********************************END POINTS*************************************************
**************************************👇****************************************************/

// get all tickets
router.get( "/", ( rq, res ) =>
{
    res.send( "Get all tickets wired!" );
} );

module.exports = router;