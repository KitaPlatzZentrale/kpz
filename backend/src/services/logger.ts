import * as winston from "winston";

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.json()
);

// create a new logger instance
const logger = winston.createLogger({
  level: "info",
  format: jsonFormat,
  defaultMeta: { service: `kpz-${process.env.NODE_ENV}-backend` },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: consoleFormat,
      level: "info",
      handleExceptions: true,
      stderrLevels: ["error"],
    }),
  ],
  exitOnError: false,
});

export default logger;
