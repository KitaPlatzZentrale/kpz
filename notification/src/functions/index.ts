import { Handler } from "aws-lambda";
import { sendSlackEmailNotification } from "../sender/sendNotification";

interface IMongoDBSignupEvent {
  "detail-type": string;
  detail: {
    fullDocument: {
      email: string;
    };
  };
}

export const handler: Handler = async (event: IMongoDBSignupEvent, context) => {
  const eventType = event["detail-type"];
  const email = event.detail.fullDocument.email;

  if (!email) {
    throw new Error("No recipient with `to` specified");
  }

  try {
    switch (eventType) {
      case "MongoDB Database Trigger for test.users":
        await sendSlackEmailNotification({
          email,
          eventDescription: "New User Signup",
        });
        break;
      case "MongoDB Database Trigger for test.emailservices":
        await sendSlackEmailNotification({
          email,
          eventDescription: "New Email Service Signup",
        });
        break;
      case "MongoDB Database Trigger for realData.kitadetails":
        await sendSlackEmailNotification({
          email,
          eventDescription: "New Kita Details Signup",
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
