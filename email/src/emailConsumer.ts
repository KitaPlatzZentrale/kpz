import amqp from "amqplib";

// RabbitMQ configuration
const rabbitmqHost = "rabbitmq-service";
const rabbitmqPort = 5672;
const rabbitmqQueue = "SingupQue";
const rabbitmqUser = "kpz-dev";
const rabbitmqPass = "kpz-dev";

// Define a generic type for the object you want to receive

async function consumeMessageFromRabbitMQ<T>(callback: (data: T) => void) {
  try {
    const connection = await amqp.connect({
      hostname: rabbitmqHost,
      port: rabbitmqPort,
      username: rabbitmqUser,
      password: rabbitmqPass,
    });

    const channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqQueue);

    // Define the function to process incoming messages
    const processMessage = (message: amqp.Message | null) => {
      if (message) {
        const content = message.content.toString();
        const rabbitMQMessage = JSON.parse(content);
        console.log("processMessage RabbitMQ:", rabbitMQMessage);
        callback(rabbitMQMessage);
        channel.ack(message); // Acknowledge the message to remove it from the queue
      }
    };

    // Consume messages from the queue
    channel.consume(rabbitmqQueue, processMessage);

    console.log("Email service consumer started. Waiting for messages...");
  } catch (error) {
    console.error("Error consuming messages from RabbitMQ:", error.message);
  }
}

export default consumeMessageFromRabbitMQ;
