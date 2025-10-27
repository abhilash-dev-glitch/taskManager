import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            retryWrites: true,
            w: 'majority'
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            logger.info('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error(`Mongoose connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('Mongoose connection closed through app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export default connectDB;