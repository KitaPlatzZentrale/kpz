import serverless from 'serverless-http';
import app from './index';

/**
 * AWS Lambda handler for the Express application
 * Uses serverless-http which has better compatibility with Express middleware
 * than @vendia/serverless-express for API Gateway integrations
 */
export const handler = serverless(app);
