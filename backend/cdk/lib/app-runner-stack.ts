import * as cdk from "aws-cdk-lib";
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import { Construct } from "constructs";

export class AppRunnerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appRunnerService = new apprunner.CfnService(
      this,
      "PROD_KPZ_App_Runner_Service_Stack",
      {
        serviceName: "prod_kpz-app-runner-service",
        sourceConfiguration: {
          authenticationConfiguration: {
            accessRoleArn:
              "arn:aws:iam::897331788878:role/service-role/AppRunnerECRAccessRole",
          },
          imageRepository: {
            imageIdentifier:
              "897331788878.dkr.ecr.eu-central-1.amazonaws.com/kpz_prod_apprunner:latest",
            imageRepositoryType: "ECR",
            imageConfiguration: {
              port: "8080",
              runtimeEnvironmentVariables: [],
            },
          },
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
