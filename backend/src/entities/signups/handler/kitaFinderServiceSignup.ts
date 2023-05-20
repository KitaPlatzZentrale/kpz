import { RequestHandler } from "express";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  validate,
} from "class-validator";
import logger from "../../../logger";
import { EmailSignup } from "../service";

interface IKitaFinderServiceSignup {
  email: string;
  consentId: string;
  fullAddress: string;
  desiredStartingMonth: string;
  actualOrExpectedBirthMonth: string;
  createdAt: string;
  consentedAt: string;
  revokedAt?: string | null;
}
class KitaFinderServiceSignupValidator {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  consentId: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @IsString()
  @IsNotEmpty()
  desiredStartingMonth: string;

  @IsString()
  @IsNotEmpty()
  actualOrExpectedBirthMonth: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  consentedAt: string;

  @IsOptional()
  @IsString()
  revokedAt: string | null;
}

export const validator: RequestHandler<IKitaFinderServiceSignup> = async (
  req,
  res,
  next
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      email,
      consentId,
      fullAddress,
      desiredStartingMonth,
      actualOrExpectedBirthMonth,
      createdAt,
      consentedAt,
      revokedAt,
    } = req.body;
    const newServiceSignup = new KitaFinderServiceSignupValidator();
    newServiceSignup.email = email;
    newServiceSignup.consentId = consentId;
    newServiceSignup.fullAddress = fullAddress;
    newServiceSignup.desiredStartingMonth = desiredStartingMonth;
    newServiceSignup.actualOrExpectedBirthMonth = actualOrExpectedBirthMonth;
    newServiceSignup.createdAt = createdAt;
    newServiceSignup.consentedAt = consentedAt;
    newServiceSignup.revokedAt = revokedAt;
    const errors = await validate(newServiceSignup);

    if (errors.length) return res.status(400).json({ error: errors });

    return next();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const handler: RequestHandler<IKitaFinderServiceSignup> = async (req, res) => {
  try {
    const {
      email,
      consentId,
      fullAddress,
      desiredStartingMonth,
      actualOrExpectedBirthMonth,
      createdAt,
      consentedAt,
      revokedAt,
    } = req.body;

    await EmailSignup.kitaFinderServiceSignup(
      email,
      consentId,
      fullAddress,
      desiredStartingMonth,
      actualOrExpectedBirthMonth,
      createdAt,
      consentedAt,
      revokedAt
    );

    return res.status(200).send();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
