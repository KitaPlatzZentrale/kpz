import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import consumeMessageFromRabbitMQ from "./rabbitmqConsumer";
import sendServiceSingupEmail from "./functions/sendServiceSignupEmail";
import sendSingleKitaNotificationSignupEmail from "./functions/sendSingleKitaNotificationsEmail";
import sendAreaNotificationSingupEmail from "./functions/sendAreaNotificationsEmail";
dotenv.config();

const app = express();
app.use(express.json()); // Add this line to parse incoming JSON data

const PORT = 3000;

// Example callback function to process incoming messages
const processEmailMessage = (emailData: any) => {
  console.log("Received EmailProps object from RabbitMQ:", emailData);
  // Replace this with your email sending logic
  if (emailData.data.type === "areaNotification") {
    sendAreaNotificationSingupEmail(emailData);
  }
  if (emailData.data.type === "singleKitaNotification") {
    sendSingleKitaNotificationSignupEmail(emailData);
  }
  if (emailData.data.type === "kitaFinderService") {
    sendServiceSingupEmail(emailData);
  }
};

// Start consuming messages from RabbitMQ
consumeMessageFromRabbitMQ(processEmailMessage);

app.use(routes);
app.listen(PORT, () => {
  console.log(`Location service is running on port ${PORT}`);
});
