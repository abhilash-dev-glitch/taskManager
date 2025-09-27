// server/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Determine the correct status code (default to 500 if not set)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);

    res.json({
        message: err.message,
        // Only include the stack trace in development environment
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};