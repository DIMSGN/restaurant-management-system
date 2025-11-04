import winston from 'winston';
import { config } from '../config/config';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development (more readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaString = '';
    if (Object.keys(meta).length > 0) {
      metaString = JSON.stringify(meta, null, 2);
    }
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'restaurant-management-api' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: config.nodeEnv === 'production' ? logFormat : consoleFormat,
    }),
    // Write errors to error.log file (production)
    ...(config.nodeEnv === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ]
      : []),
  ],
});

// Stream for Morgan HTTP logger
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
