const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Define the custom format for log messages
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create the logger
const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'server.log' })
    ]
});

module.exports = logger;
