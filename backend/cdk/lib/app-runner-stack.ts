import * as cdk from "aws-cdk-lib";
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import { Construct } from "constructs";

export class AppRunnerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appRunnerService = new apprunner.CfnService(
      this,
      "PROD_KPZ_App_Runner_Service",
      {
        serviceName: "prod_kpz-app-runner-service",
        sourceConfiguration: {
          imageRepository: {
            imageIdentifier: "public.ecr.aws/b2z0n9v4/apprunner:latest",
            imageRepositoryType: "ECR_PUBLIC",
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
