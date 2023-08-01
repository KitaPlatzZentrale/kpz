import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";
import sendMessageToRabbitMQ from "../../../rabbitmq";

/**
 * Request handler for signing up for area notification.
 *
 * @param req - The request object containing the signup data.
 * @param res - The response object used to send the response.
 *
 * @returns A response indicating the success or failure of the area notification signup.
 */
const handler: RequestHandler<IAreaNotificationSignup> = async (req, res) => {
  try {
    await EmailSignup.areaNotificationSignup(req.body);
    req.body.type = "areaNotification";
    req.body.createdAt = new Date();
    req.body.consentedAt = new Date();
    req.body.revokedAt = null;
    req.body.consentId = "1234567890";
    await sendMessageToRabbitMQ(req.body);
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
