import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";

const handler: RequestHandler<IRevokeConsent> = async (req, res) => {
  try {
    const consentId = req.params.consentId;
    await EmailSignup.revokeConsent(consentId);
    return res.status(200).send("Consent revoked");
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
