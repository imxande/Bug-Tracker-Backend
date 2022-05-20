// Global error handler
// prettier-ignore
const globalErrorHandler = ( error, req, res, next ) => // eslint-disable-line
{
    // send status  Internal Server Error and error message
    res.status( error.status || 500 ).json( {
        message: error.message,
        stack: error.stack
    } );
};

module.exports = globalErrorHandler;
