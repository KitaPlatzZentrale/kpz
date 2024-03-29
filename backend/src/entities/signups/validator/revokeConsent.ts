import { IsNotEmpty, IsString, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
class RevokeConsentValidator {
  @IsString()
  @IsNotEmpty()
  consentId: string;
}

export const validator: RequestHandler<any, any, IRevokeConsent> = async (
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
