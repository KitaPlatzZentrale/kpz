import { IsNotEmpty, IsString, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
import { IConsentParams } from "../types";

class ConsentValidator {
  @IsString()
  @IsNotEmpty()
  consentId: string;
}

export const validator: RequestHandler<any, any, IConsentParams> = async (
  req,
  res,
  next
) => {
  try {
    const { consentId } = req.params;
    const newConsent = new ConsentValidator();
    newConsent.consentId = consentId;
    const errors = await validate(newConsent);
    if (errors.length) return res.status(400).json({ error: errors });
    return next();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};
