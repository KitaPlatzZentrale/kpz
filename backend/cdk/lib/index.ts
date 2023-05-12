import * as cdk from "aws-cdk-lib";
import { AppRunnerStack } from "./app-runner-stack";

const app = new cdk.App();
new AppRunnerStack(app, "AppRunnerStack");
