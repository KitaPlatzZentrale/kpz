import { RequestHandler } from "express";
import logger from "../../../logger";
import User from "../service";
import { IConsentParams } from "../types";
/**
 * Request handler for deleting outdated user data.
 *
 * @param req - The request object.
 * @param res - The response object used to send the response.
 *
 * @returns A response indicating the status of the operation.
 */
const handler: RequestHandler<any, any, IConsentParams> = async (req, res) => {
  try {
    const { consentId } = req.params;
    await User.confirmConsent({ consentId });
    return res.status(200).send("Consent confirmed");
  } catch (e: any) {
    logger.error(`Error in confirmConsent: ${e.message || e}`);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
