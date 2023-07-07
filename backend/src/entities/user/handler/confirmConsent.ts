import { RequestHandler } from "express";
import logger from "../../../logger";
import User from "../service";
import { IConsentParams } from "../types";

const handler: RequestHandler<any, any, IConsentParams> = async (req, res) => {
  try {
    const { consentId } = req.params;
    await User.confirmConsent({ consentId });
    return res.status(200).send("Consent confirmed");
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
