import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";

/**
 * Request handler for performing signup for a single Kita notification.
 *
 * @param req - The request object containing the signup data.
 * @param res - The response object used to send the response.
 *
 * @returns A response indicating the success or failure of the signup.
 */
const handler: RequestHandler<ISingleKitaNotification> = async (req, res) => {
  try {
    await EmailSignup.singleKitaNotificationSignup(req.body);
    return res.status(200).send();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
