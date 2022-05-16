// global error handler
const globalErrorHandler = ( error, req, res ) =>
{
    // send status  Internal Server Error and error message
    res.status( error.status || 500 ).json( {
        message: error.message,
        stack: error.stack
    } );
};

module.exports = globalErrorHandler;