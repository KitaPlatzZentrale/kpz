import axios from "axios";
require("dotenv").config();

export async function sendSlackErrorNotification(message: string) {
  try {
    if (!process.env.SLACK_WEBHOOK_ERROR_URL) {
      throw new Error(
        "No Slack webhook URL specified -> In Lambda Config -> Environment variables "
      );
    }
    const webhookUrl = process.env.SLACK_WEBHOOK_ERROR_URL;

    const response = await axios.post(webhookUrl, { text: message });
    console.log("Slack message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
}
