# API Gateway + Lambda: Body Parser "stream is not readable" Error

## Problem Summary
The backend Lambda function deployed behind API Gateway HTTP API consistently fails with `InternalServerError: stream is not readable` when processing POST requests with JSON bodies.

## Root Cause
`@vendia/serverless-express` v4.12.6 has incompatibility issues with Express `body-parser` middleware (specifically `express.json()`) when used with API Gateway HTTP API, regardless of payload format version (1.0 or 2.0).

The error occurs because:
1. API Gateway sends the request body as a string in the Lambda event
2. `@vendia/serverless-express` creates a mock `IncomingMessage` stream from this string
3. When `express.json()` middleware tries to read from this stream using the `raw-body` package, the stream is in an invalid state
4. Error: `stream is not readable`

## Technical Details

**Error Stack Trace:**
```
InternalServerError: stream is not readable
    at readStream (/var/task/node_modules/raw-body/index.js:185:17)
    at getRawBody (/var/task/node_modules/raw-body/index.js:116:12)
    at read (/var/task/node_modules/body-parser/lib/read.js:79:3)
    at jsonParser (/var/task/node_modules/body-parser/lib/types/json.js:138:5)
```

**Current Stack:**
- `@vendia/serverless-express`: 4.12.6 (latest)
- `express`: 4.18.2
- `body-parser`: Built into Express
- API Gateway: HTTP API (aws_apigatewayv2_api)
- Integration: AWS_PROXY

**Attempted Solutions That Did NOT Work:**
1. ❌ Changing API Gateway payload format from 2.0 to 1.0
2. ❌ Adding `trust proxy` configuration to Express
3. ❌ Removing duplicate `express.json()` middleware calls
4. ❌ Conditionally disabling `express.json()` in Lambda environment
5. ❌ Custom middleware to manually parse body from API Gateway event
6. ❌ Pre-processing API Gateway event body before passing to serverless-express
7. ❌ Configuring serverless-express with different options

## Impact
- **Severity**: Critical
- **Affected**: All POST/PUT/PATCH endpoints that accept JSON bodies
- **User Impact**: Complete API failure for location service and signup endpoints
- **Environment**: Production Lambda deployment only (local development works fine)

## Recommended Solution
Switch from `@vendia/serverless-express` to `serverless-http`, which is known to have better compatibility with Express middleware:

```bash
npm uninstall @vendia/serverless-express
npm install serverless-http
```

Update `backend/src/lambda.ts`:
```typescript
import serverless from 'serverless-http';
import app from './index';

export const handler = serverless(app);
```

## Why This Happens Only in Lambda

**Local Development (Works):**
- Express runs as normal HTTP server
- Node.js provides genuine readable streams for incoming requests
- Body-parser reads from real HTTP request streams

**AWS Lambda (Fails):**
- API Gateway → Lambda event (body as string)
- `@vendia/serverless-express` creates mock request stream
- Mock stream doesn't behave like a real Node.js HTTP stream
- Body-parser fails to read from mock stream

## References
- API Gateway Payload Format: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
- @vendia/serverless-express: https://github.com/vendia/serverless-express
- serverless-http: https://github.com/dougmoscrop/serverless-http
- Related issues: Similar problems reported in serverless-express issues

## Testing Plan
After switching to `serverless-http`:
1. Deploy to dev environment
2. Test location-service endpoint: `POST /location-service`
3. Test signup endpoints: `POST /signup/kita-finder`, `POST /signup/single`
4. Verify response parsing works correctly
5. Monitor CloudWatch logs for errors

## Labels
- `bug`
- `critical`
- `backend`
- `infrastructure`
- `lambda`
