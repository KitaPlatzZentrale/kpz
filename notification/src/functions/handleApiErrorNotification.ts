import { Handler } from "aws-lambda";
import { sendSlackErrorNotification } from "../sender/sendSlackErrorNotification";
/**
 * Lambda Function: CloudWatchAlarmHandler
 *
 * Description:
 * This Lambda function handles CloudWatch alarm events and sends notifications to Slack.
 * When a CloudWatch alarm state changes, a notification is sent to Slack containing details
 * about the alarm, such as the alarm name, state change time, new state value, and associated resources.
 *
 * ...

 * Sample Event:
 * {
 *   "detail": {
 *     "alarmName": "MyAlarm",
 *     "stateChangeTime": "2023-06-08T12:34:56Z",
 *     "newStateValue": "ALARM",
 *     "region": "us-west-2",
 *     "resources": [
 *       "arn:aws:apprunner:us-west-2:123456789012:service/MyAppRunnerService"
 *     ]
 *   }
 * }
 */

interface ICloudWatchAlarmEvent {
  detail: {
    alarmName: string;
    stateChangeTime: string;
    newStateValue: string;
    region: string;
    resources: string[];
  };
}

export const handler: Handler = async (event: ICloudWatchAlarmEvent) => {
  try {
    const alarmName = event.detail.alarmName;
    const stateChangeTime = event.detail.stateChangeTime;
    const newStateValue = event.detail.newStateValue;
    const resources = event.detail.resources;
    const logUrl =
      "https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups/log-group/$252Faws$252Fapprunner$252FPROD-KPZ-APP-RUNNER-SERVICE$252F99949951b7124c0a9f1203775a8215ca$252Fapplication";

    // Construct Slack message
    const logLink = `Logs: ${logUrl}`;
    const message = `*Alarm Name:* ${alarmName}\n*State Change Time:* ${stateChangeTime}\n*New State Value:* ${newStateValue}\n*Resources:* ${resources.join(
      ", "
    )}\n\n*${logLink}*`;

    // Send message to Slack
    await sendSlackErrorNotification(message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
