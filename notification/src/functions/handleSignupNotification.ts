import { sendSlackSignupNotification as sendSlackSingupNotification } from "../sender/sendSlackSignupNotification";

interface SignupEvent {
  data: { eventType: string };
}

/**
 * Function to process RabbitMQ events based on the event type.
 * @param event The RabbitMQ event data.
 */
export const processSingupEvent = async (event: SignupEvent) => {
  try {
    console.log("Received RabbitMQ event:", event);

    // Process event based on event type
    switch (event.data.eventType) {
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
        console.log(`Unrecognized event type: ${event.data.eventType}`);
        break;
    }
  } catch (error) {
    console.error("Error processing RabbitMQ event:", error);
  }
};
