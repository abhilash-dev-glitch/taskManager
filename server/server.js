import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

// Load environment variables
const result = dotenv.config();
if (result.error) {
    logger.warn('No .env file found, using environment variables');
}

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Connect to database
connectDB()
    .then(() => {
        // Start server after successful DB connection
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    })
    .catch((error) => {
        logger.error(`Failed to connect to database: ${error.message}`);
        process.exit(1);
    });

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val; // named pipe
    if (port >= 0) return port; // port number
    return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Server running in ${process.env.NODE_ENV} mode on ${bind}`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

// Handle SIGTERM signal (for Docker, Kubernetes, etc.)
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
    });
});