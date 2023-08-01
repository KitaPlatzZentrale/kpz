import amqp from "amqplib";

// RabbitMQ configuration
const rabbitmqHost = "rabbitmq-service";
const rabbitmqPort = 5672;
const rabbitmqQueue = "SingupQue";
const rabbitmqUser = "kpz-dev";
const rabbitmqPass = "kpz-dev";

// Define a generic type for the object you want to send
interface RabbitMQMessage<T> {
  data: T;
}

async function sendMessageToRabbitMQ<T>(obj: T) {
  try {
    const connection = await amqp.connect({
      hostname: rabbitmqHost,
      port: rabbitmqPort,
      username: rabbitmqUser,
      password: rabbitmqPass,
    });

    const channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqQueue);

    const rabbitMQMessage: RabbitMQMessage<T> = { data: obj };
    const message = JSON.stringify(rabbitMQMessage);
    console.log("sendMessageToRabbitMQ:", message);
    channel.sendToQueue(rabbitmqQueue, Buffer.from(message));

    console.log("Message sent to RabbitMQ:", obj);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error.message);
  }
}

export default sendMessageToRabbitMQ;
