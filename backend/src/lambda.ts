import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';
import app from './index';

// Create the serverless-express handler once and reuse it
const serverlessExpressHandler = serverlessExpress({ app });

/**
 * AWS Lambda handler for the Express application
 * Uses serverless-express to adapt Express for Lambda Function URLs
 */
export const handler: Handler = (event, context, callback) => {
  return serverlessExpressHandler(event, context, callback);
};
