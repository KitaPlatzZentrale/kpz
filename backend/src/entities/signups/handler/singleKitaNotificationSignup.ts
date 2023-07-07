import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";

const handler: RequestHandler<ISingleKitaNotification> = async (req, res) => {
  try {
    const { email, kitaId, kitaDesiredAvailability, kitaName } = req.body;

    await EmailSignup.singleKitaNotificationSignup(
      email,
      kitaId,
      kitaDesiredAvailability,
      kitaName
    );

    return res.status(200).send();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
