import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";

/**
 * Request handler for revoking consent and deleting associated data.
 *
 * @param req - The request object containing the consent ID.
 * @param res - The response object used to send the response.
 *
 * @returns A response indicating the success or failure of the consent revocation.
 */
const handler: RequestHandler<IRevokeConsent> = async (req, res) => {
  try {
    const consentId = req.params.consentId;
    await EmailSignup.revokeConsent(consentId);
    return res.status(200).send("Consent revoked");
  } catch (e: any) {
    logger.error(`Error in revokeConsent: ${e.message || e}`);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
