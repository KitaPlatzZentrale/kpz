import { Handler } from "aws-lambda";
import { sendSlackSignupNotification as sendSlackSingupNotification } from "../sender/sendSlackSignupNotification";

interface ISNSSignupEvent {
  Records: [
    // This format is for our SNS lambda alarm
    {
      Sns: {
        Message: string; // the message also contains the detail object
      };
    }
  ];
}

/**
 * Lambda Function Handler
 * @param event The MongoDB trigger event.
 * @param context The execution context of the Lambda function.
 */
export const handler: Handler = async (event: ISNSSignupEvent, context) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));
    const message = event.Records[0].Sns.Message;
    const parsedEventMessage = JSON.parse(message);
    // Extract event details
    const eventType = parsedEventMessage.detail.alarmName;

    // Process event based on event type
    switch (eventType) {
      case "signupToSingleKitaAvailableEmail":
        console.log("Sending notification for new User signup");
        await sendSlackSingupNotification({
          eventDescription: "New User Signup",
        });
        break;
      case "singupToKitaFinderServiceEmail":
        console.log("Sending notification for new Email Service signup");
        await sendSlackSingupNotification({
          eventDescription: "New Email Service Signup",
        });
        break;
      case "signupToAreaNotificationEmail":
        console.log("Sending notification for new Kita Areas signup");
        await sendSlackSingupNotification({
          eventDescription: "New Kita Area Signup",
        });
        break;
      default:
        console.log(`Unrecognized event type: ${eventType}`);
        break;
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
