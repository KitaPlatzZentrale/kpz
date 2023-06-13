import axios from "axios";

export async function sendSlackErrorNotification(message: string) {
  try {
    const webhookUrl =
      "https://hooks.slack.com/services/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";

    const response = await axios.post(webhookUrl, { text: message });
    console.log("Slack message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
}
