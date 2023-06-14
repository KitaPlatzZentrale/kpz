/**
 * Lambda Function: MongoDBSignupHandler
 *
 * Description:
 * This Lambda function handles MongoDB database triggers for various events, such as new user signups,
 * email service signups, and Kita details signups. It sends a notification to Slack for each event.
 *
 * Input:
 * - event: An object containing details about the MongoDB trigger event.
 * - context: The execution context of the Lambda function.
 *
 * Output:
 * This Lambda function does not return any value.
 *
 * Usage:
 * This Lambda function is triggered by MongoDB database events and requires appropriate permissions
 * to access the MongoDB collection and invoke the necessary APIs.
 *
 * Sample Event:
 * {
 *   "detail-type": "MongoDB Database Trigger for test.users",
 *   "detail": {
 *     "fullDocument": {
 *       "email": "example@example.com"
 *     }
 *   }
 * }
 */

import { Handler } from "aws-lambda";
import { sendSlackSignupNotification as sendSlackSingupNotification } from "../sender/sendSlackSignupNotification";

/**
 * Interface: IMongoDBSignupEvent
 * Represents the structure of the MongoDB trigger event.
 */
interface IMongoDBSignupEvent {
  "detail-type": string;
  detail: {
    fullDocument: {
      email: string;
      sendEmail?: boolean;
    };
  };
}

/**
 * Lambda Function Handler
 * @param event The MongoDB trigger event.
 * @param context The execution context of the Lambda function.
 */
export const handler: Handler = async (event: IMongoDBSignupEvent, context) => {
  try {
    if (event.detail.fullDocument.sendEmail === false) {
      console.log("Email sending is disabled for this event");
      return;
    }
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Extract event details
    const eventType = event["detail-type"];
    const email = event.detail.fullDocument.email;

    // Validate email existence
    if (!email) {
      throw new Error("No recipient email specified");
    }

    // Process event based on event type
    switch (eventType) {
      case "MongoDB Database Trigger for test.users":
        console.log("Sending notification for new User signup");
        await sendSlackSingupNotification({
          email,
          eventDescription: "New User Signup",
        });
        break;
      case "MongoDB Database Trigger for test.emailservices":
        console.log("Sending notification for new Email Service signup");
        await sendSlackSingupNotification({
          email,
          eventDescription: "New Email Service Signup",
        });
        break;
      case "MongoDB Database Trigger for test.areas":
        console.log("Sending notification for new Kita Areas signup");
        await sendSlackSingupNotification({
          email,
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
