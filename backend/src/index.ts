import dotenv from "dotenv";
dotenv.config();
import express = require("express");
import routes = require("./routes");
import logger from "./logger";
import { connectToDatabase } from "./database";
import cors from "cors";

import hpp from "hpp";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { checkIfAllEnvVariablesAreSet } from "./utils/validateEnv";

checkIfAllEnvVariablesAreSet();

const app = express();

// Base Helmet utilization
app.use(helmet()); // Helmpflicht.
app.use(helmet.hsts({ maxAge: 31536000 })); // Helmpflicht.
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      frameAncestors: ["'none'"],
      imgSrc: ["self"],
    },
  })
);
app.use(helmet.noSniff());
app.use(helmet.frameguard());

// Reduce fingerprint: Obfuscate the "X-Powered-By: Express" HTTP header to reduce the risk of attacks against known vulnerabilities in Express
// We are now publicly powered by PHP :cool:
const PoweredByObfuscation = (req: any, res: any, next: any) => {
  res.setHeader("X-Powered-By", "PHP/7.4.21");
  next();
};
app.use(PoweredByObfuscation);

// Protect against HTTP Parameter Pollution attacks, e.g. /api?sort=asc&sort=desc
// We may want to turn off hpp for routes that require/utilize multiple values for a parameter
app.use(hpp());

// Request Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  statusCode: 429, // Too Many Requests (RFC 6585)
  standardHeaders: true, // Return rate limit info in the "Rate-Limit-*" header
  legacyHeaders: false, // Disable the "X-RateLimit-*" headers
});
app.use(limiter);

// Request Payload Limiting
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.use(cors());
app.use(express.json());

app.use("", routes);

connectToDatabase();

// Only start the server if not running in AWS Lambda environment
// In Lambda, the server is started by the lambda.ts handler
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
}

// Export the app for Lambda handler
export default app;
