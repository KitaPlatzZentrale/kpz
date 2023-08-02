import { sendSlackErrorNotification } from "../sender/sendSlackErrorNotification";

interface RabbitMQErrorEvent {
  data: {
    alarmName: string;
  };
}

/**
 * Function to process RabbitMQ error events.
 * @param event The RabbitMQ error event data.
 */
export const processRabbitMQErrorEvent = async (event: RabbitMQErrorEvent) => {
  try {
    console.log("Received RabbitMQ error event:", event);

    const message = event.data.alarmName;

    // Send message to Slack
    await sendSlackErrorNotification(message);
  } catch (error) {
    console.error("Error processing RabbitMQ error event:", error);
  }
};
