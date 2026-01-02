import serverlessExpress from '@vendia/serverless-express';
import { Handler, APIGatewayProxyEvent } from 'aws-lambda';
import app from './index';

/**
 * Middleware to inject parsed body into request
 * This bypasses the need for express.json() in Lambda
 */
const injectParsedBody = (req: any, res: any, next: any) => {
  // If running in Lambda and body hasn't been parsed yet
  if (process.env.AWS_LAMBDA_FUNCTION_NAME && req.apiGateway && req.apiGateway.event.body) {
    try {
      const bodyString = req.apiGateway.event.isBase64Encoded
        ? Buffer.from(req.apiGateway.event.body, 'base64').toString('utf-8')
        : req.apiGateway.event.body;
      req.body = JSON.parse(bodyString);
    } catch (err) {
      console.error('Failed to parse request body:', err);
    }
  }
  next();
};

// Add the middleware at the beginning of the stack
app.use(injectParsedBody);

// Create the serverless-express handler
const serverlessExpressHandler = serverlessExpress({ app });

/**
 * AWS Lambda handler for the Express application
 * Uses serverless-express to adapt Express for Lambda Function URLs
 */
export const handler: Handler = (event: APIGatewayProxyEvent, context, callback) => {
  return serverlessExpressHandler(event, context, callback);
};
