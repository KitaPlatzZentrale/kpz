import * as cdk from "aws-cdk-lib";
import { AppRunnerStack } from "./app-runner-stack";
import * as dotenv from "dotenv";

dotenv.config();
const app = new cdk.App();
new AppRunnerStack(app, process.env.APP_RUNNER_SERVICE_NAME!);
