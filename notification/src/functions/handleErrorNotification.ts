import { Handler } from "aws-lambda";
import { sendSlackErrorNotification } from "../sender/sendSlackErrorNotification";
/**
 * Lambda Function: CloudWatchAlarmHandler
 *
 * Description:
 * This Lambda function handles CloudWatch alarm events and sends notifications to Slack.
 * When a CloudWatch alarm state changes, a notification is sent to Slack containing details
 * about the alarm, such as the alarm name and associated resources.
 *
 * ...

 * Sample Event:
 * {
 *   "detail": {
 *     "alarmName": "MyAlarm",
 *     "resources": [
 *       "arn:aws:apprunner:us-west-2:123456789012:service/MyAppRunnerService"
 *     ]
 *   }
 * }
 */

interface IErrorEvent {
  detail: {
    // This format is for our CloudWatch Alarms
    alarmName: string;
    resources: string[];
  };
  Records?: [
    // This format is for our SNS lambda alarm
    {
      Sns: {
        Message: string; // the message also contains the detail object
      };
    }
  ];
}

export const handler: Handler = async (event: IErrorEvent) => {
  try {
    // this is because we get Errors from SNS and from CloudWatch Alarms
    if (event.Records) {
      const message = event.Records[0].Sns.Message;
      event = JSON.parse(message);
    }
    const alarmName = event.detail.alarmName;
    const resources = event.detail.resources.join(", ");
    const awsFunctionOrServiceName = resources.split("/").pop();
    const awsFunctionOrService = resources.split(":")[2];
    const cloudWatchLogs = `https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups/log-group/$252Faws$252F${awsFunctionOrService}$252F${awsFunctionOrServiceName}`;

    if (!cloudWatchLogs) {
      throw new Error("No CLOUDWATCH_LOG_URL");
    }

    // Construct Slack message
    const logLink = `*Logs*: ${cloudWatchLogs}`;
    const message = `*Alarm Name:* ${alarmName}\n*Resources:* ${resources}\n\n${logLink}`;

    // Send message to Slack
    await sendSlackErrorNotification(message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
