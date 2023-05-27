import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";
import { IsNotEmpty, IsString, validate } from "class-validator";

interface IRevokeConsent {
  consentId: string;
}

class RevokeConsentValidator {
  @IsString()
  @IsNotEmpty()
  consentId: string;
}

export const validator: RequestHandler<IRevokeConsent> = async (
  req,
  res,
  next
) => {
  try {
    const revokeConsentValidator = new RevokeConsentValidator();
    revokeConsentValidator.consentId = req.params.consentId;
    const errors = await validate(revokeConsentValidator);
    if (errors.length > 0) {
      logger.error(errors);
      return res.status(500).send("Something went wrong");
    }
    return next();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

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
