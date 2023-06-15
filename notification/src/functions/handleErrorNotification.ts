import { Handler } from "aws-lambda";
import { sendSlackErrorNotification } from "../sender/sendSlackErrorNotification";
require("dotenv").config();
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
    alarmName: string;
    resources: string[];
  };
}

export const handler: Handler = async (event: IErrorEvent) => {
  try {
    const alarmName = event.detail.alarmName;
    const resources = event.detail.resources.join(", ");
    const awsFunctionOrServiceName = resources.split("/")[-1];
    const awsFunctionOrService = resources.split(":")[2];
    const cloudWatchLogs = `https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups/log-group/$252Faws$252F${awsFunctionOrService}$252F${awsFunctionOrServiceName}`;

    if (!cloudWatchLogs) {
      throw new Error("No CLOUDWATCH_LOG_URL");
    }

    // Construct Slack message
    const logLink = `Logs: ${cloudWatchLogs}`;
    const message = `*Alarm Name:* ${alarmName}\n*Resources:* ${resources}\n\n*${logLink}*`;

    // Send message to Slack
    await sendSlackErrorNotification(message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
