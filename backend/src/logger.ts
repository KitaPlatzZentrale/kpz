import * as winston from "winston";

const consoleFormat = winston.format.combine(
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
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
    level: "info",
    handleExceptions: true,
    stderrLevels: ["error"],
  }),
];

// Only add file transports when not in Lambda environment
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  transports.push(
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  );
}

const logger = winston.createLogger({
  level: "info",
  format: jsonFormat,
  defaultMeta: { service: `kpz-${process.env.NODE_ENV}-backend` },
  transports,
  exitOnError: false,
});

export default logger;
