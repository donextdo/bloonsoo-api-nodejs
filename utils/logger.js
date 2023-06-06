import winston from "winston"
const { combine, timestamp, printf } = winston.format
import dayjs from "dayjs";
import { config } from "dotenv";

config()

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
});

let transports = []

if (process.env.NODE_ENV === 'production') {
    transports = [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' })
    ];
} else {
    transports = [new winston.transports.Console()];
}

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({
        format: () => `TIME: ${dayjs().format()}`
    }),
    myFormat
  ),
  transports: transports
})

export default logger