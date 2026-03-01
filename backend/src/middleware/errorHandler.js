export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Default error
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = err.message;
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized';
    } else if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate entry';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }
  
    res.status(statusCode).json({
      message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };