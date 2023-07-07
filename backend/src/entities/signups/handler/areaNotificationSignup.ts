import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";

const handler: RequestHandler<IAreaNotificationSignup> = async (req, res) => {
  try {
    const { email, areaDescription, revokedAt } = req.body;
    await EmailSignup.areaNotificationSignup(email, areaDescription, revokedAt);
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
