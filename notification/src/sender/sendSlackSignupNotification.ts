import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
/**
 * Function: sendSlackMessage
 * Sends a notification message to Slack using the provided webhook URL.
 * @param slackEmail An object containing the email and event description for the Slack message.
 */

interface ISlackEmail {
  eventDescription: string;
}

export async function sendSlackSignupNotification(slackEmail: ISlackEmail) {
  try {
    if (!process.env.SLACK_WEBHOOK_SIGNUP_URL) {
      throw new Error(
        "No Slack webhook URL specified -> In Lambda Config -> Environment variables "
      );
    }

    const webhookUrl = process.env.SLACK_WEBHOOK_SIGNUP_URL;
    const smileys = [":rocket:", ":beers:", ":tada:", ":fireworks:"];
    const randomSmiley = smileys[Math.floor(Math.random() * smileys.length)];
    const message = {
      text: `*${slackEmail.eventDescription}*  ${randomSmiley}`,
    };

    const response = await axios.post(webhookUrl, message);
    console.log("Slack message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
}
