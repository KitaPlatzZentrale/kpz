import * as cdk from "aws-cdk-lib";
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import { Construct } from "constructs";
import * as dotenv from "dotenv";

dotenv.config();

export class AppRunnerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appRunnerService = new apprunner.CfnService(
      this,
      process.env.APP_RUNNER_SERVICE_NAME!,
      {
        serviceName: process.env.APP_RUNNER_SERVICE_NAME!,
        sourceConfiguration: {
          authenticationConfiguration: {
            accessRoleArn:
              "arn:aws:iam::897331788878:role/service-role/AppRunnerECRAccessRole",
          },
          imageRepository: {
            imageIdentifier: process.env.IMAGE_IDENTIFIER!,
            imageRepositoryType: "ECR",
            imageConfiguration: {
              port: process.env.PORT!,
              runtimeEnvironmentVariables: [
                {
                  name: "MONGO_DB_CONNECTION",
                  value: process.env.MONGO_DB_CONNECTION!,
                },
                {
                  name: "S3_BUCKET",
                  value: process.env.S3_BUCKET!,
                },
                {
                  name: "AIRTABLE_API_KEY",
                  value: process.env.AIRTABLE_API_KEY!,
                },
                { name: "AIRTABLE_BASE", value: process.env.AIRTABLE_BASE! },
              ],
            },
          },
        },
        instanceConfiguration: {
          cpu: process.env.CPU!,
          memory: process.env.MEMORY!,
        },
      }
    );

    const appRunnerUrl = appRunnerService.attrServiceUrl;
    new cdk.CfnOutput(this, "AppRunnerServiceUrl", {
      value: appRunnerUrl,
      description: "The URL of the App Runner service",
    });
  }
}
