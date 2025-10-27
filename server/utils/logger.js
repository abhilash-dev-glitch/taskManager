import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(colors);

// Custom format for console
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    const log = `${timestamp} ${level}: ${message}`;
    return stack ? `${log}\n${stack}` : log;
});

// Custom format for files
const fileFormat = printf(({ level, message, timestamp, stack }) => {
    const log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    return stack ? `${log}\n${stack}` : log;
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

const logger = winston.createLogger({
    levels: logLevels,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        align(),
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                consoleFormat
            ),
        }),
        // Daily rotate file transport for all logs
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: fileFormat,
        }),
        // Error logs
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            format: fileFormat,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, 'rejections.log'),
        }),
    ],
});

// Create a stream object with a 'write' function that will be used by morgan
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

export default logger;
