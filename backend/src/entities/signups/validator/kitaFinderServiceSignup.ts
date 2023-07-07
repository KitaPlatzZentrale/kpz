import { RequestHandler } from "express";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  validate,
} from "class-validator";
import logger from "../../../logger";

class KitaFinderServiceSignupValidator {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @IsString()
  @IsNotEmpty()
  desiredStartingMonth: string;

  @IsString()
  @IsNotEmpty()
  actualOrExpectedBirthMonth: string;

  @IsOptional()
  @IsDateString()
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
      fullAddress,
      desiredStartingMonth,
      actualOrExpectedBirthMonth,
      revokedAt,
    } = req.body;
    const newServiceSignup = new KitaFinderServiceSignupValidator();
    newServiceSignup.email = email;
    newServiceSignup.fullAddress = fullAddress;
    newServiceSignup.desiredStartingMonth = desiredStartingMonth;
    newServiceSignup.actualOrExpectedBirthMonth = actualOrExpectedBirthMonth;
    newServiceSignup.revokedAt = revokedAt;
    const errors = await validate(newServiceSignup);

    if (errors.length) return res.status(400).json({ error: errors });

    return next();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
