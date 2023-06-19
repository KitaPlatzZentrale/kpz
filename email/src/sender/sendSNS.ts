import {
  PublishCommand,
  SNSClient,
  SNSClientConfig,
} from "@aws-sdk/client-sns";
import dotenv from "dotenv";

dotenv.config();

export const setupSNS = () => {
  const snsClientConfig: SNSClientConfig = {
    region: "eu-central-1",
  };
  const SNS = new SNSClient(snsClientConfig); // Example for Amazon SNS
  return SNS;
};

export const sendSNS = async (SNS: SNSClient, topicArn: string) => {
  const eventParams = {
    detail: {
      alarmName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      resources: [
        `arn:aws:lambda:eu-central-1:897331788878:function/${process.env.AWS_LAMBDA_FUNCTION_NAME}`,
      ],
    },
  };

  const params = {
    Message: JSON.stringify(eventParams),
    TopicArn: topicArn,
    MessageAttributes: {
      "Content-Type": {
        DataType: "String",
        StringValue: "application/json",
      },
    },
  };
  const command = new PublishCommand(params);
  await SNS.send(command);
  return;
};
