import path from 'path';
import { createLogger, format, transports } from 'winston';

const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.colorize(),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.Console({
      format: customFormat,
    }),

    new transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export default logger;
