import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";

const handler: RequestHandler<IKitaFinderServiceSignup> = async (req, res) => {
  try {
    const {
      email,
      fullAddress,
      desiredStartingMonth,
      actualOrExpectedBirthMonth,
      revokedAt,
    } = req.body;

    await EmailSignup.kitaFinderServiceSignup(
      email,
      fullAddress,
      desiredStartingMonth,
      actualOrExpectedBirthMonth,
      revokedAt
    );

    return res.status(200).send();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
