import express from "express";
import dotenv from "dotenv";
import consumeMessageFromRabbitMQ from "./notificationConsumer";

dotenv.config();

const app = express();
app.use(express.json()); // Add this line to parse incoming JSON data

const PORT = 3000;

// Example callback function to process incoming messages
const processNotification = (notification: any) => {
  console.log("Received notification object from RabbitMQ:", notification);
  if (notification.data.type === "signupSuccess") {
    console.log("Signup success notification received");
  }
  if (notification.data.type === "error") {
    console.log("Error notification received");
  }
};

// Start consuming messages from RabbitMQ
consumeMessageFromRabbitMQ(processNotification);

app.listen(PORT, () => {
  console.log(`Location service is running on port ${PORT}`);
});
