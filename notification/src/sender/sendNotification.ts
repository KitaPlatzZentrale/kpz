const { WebClient } = require("@slack/web-api");
import { config } from "dotenv";
config();

export interface ISlackEmail {
  email: string;
  eventDescription: string;
}

export async function sendSlackEmailNotification(slackEmail: ISlackEmail) {
  try {
    const TOKEN = process.env.SLACK_TOKEN;
    const CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
    const web = new WebClient(TOKEN);
    const { email, eventDescription } = slackEmail;
    console.log(
      `Sending notification to ${email} for event ${eventDescription}`
    );
    // Call the chat.postMessage method using the built-in WebClient
    const result = await web.chat.postMessage({
      channel: CHANNEL_ID,
      text: eventDescription,
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
