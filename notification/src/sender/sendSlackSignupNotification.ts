import axios from "axios";
/**
 * Function: sendSlackMessage
 * Sends a notification message to Slack using the provided webhook URL.
 * @param slackEmail An object containing the email and event description for the Slack message.
 */

interface ISlackEmail {
  email: string;
  eventDescription: string;
}

export async function sendSlackSignupNotification(slackEmail: ISlackEmail) {
  try {
    const webhookUrl =
      "https://hooks.slack.com/services/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";
    const smileys = [":rocket:", ":beers:", ":tada:", ":fireworks:"];
    const randomSmiley = smileys[Math.floor(Math.random() * smileys.length)];
    const message = {
      text: `*${slackEmail.eventDescription}* from _${slackEmail.email}_ ${randomSmiley}`,
    };

    const response = await axios.post(webhookUrl, message);
    console.log("Slack message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
}
