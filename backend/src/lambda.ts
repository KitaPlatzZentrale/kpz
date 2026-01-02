import serverlessExpress from '@vendia/serverless-express';
import { Handler, APIGatewayProxyEvent } from 'aws-lambda';
import app from './index';

// Create the serverless-express handler once and reuse it
const serverlessExpressHandler = serverlessExpress({ app });

/**
 * AWS Lambda handler for the Express application
 * Uses serverless-express to adapt Express for Lambda Function URLs
 *
 * Note: We pre-process the event to ensure the body is properly formatted
 * for Express body-parser middleware
 */
export const handler: Handler = (event: APIGatewayProxyEvent, context, callback) => {
  // Ensure body is a string (API Gateway v2 format)
  if (event.body && event.isBase64Encoded) {
    event.body = Buffer.from(event.body, 'base64').toString('utf-8');
    event.isBase64Encoded = false;
  }

  return serverlessExpressHandler(event, context, callback);
};
