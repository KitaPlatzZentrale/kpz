import { RequestHandler } from "express";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  validate,
} from "class-validator";
import logger from "../../../logger";
import { EmailSignup } from "../service";

interface ISingleKitaNotification {
  email: string;
  consentId: string;
  kitaId: string;
  kitaName: string;
  kitaDesiredAvailability: string;
  createdAt: string;
  consentedAt: string;
}

class SingleKitaNotificationValidator {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  consentId: string;

  @IsString()
  @IsNotEmpty()
  kitaId: string;

  @IsString()
  @IsNotEmpty()
  kitaName: string;

  @IsString()
  @IsNotEmpty()
  kitaDesiredAvailability: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  consentedAt: string;
}

export const validator: RequestHandler<ISingleKitaNotification> = async (
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
      kitaId,
      kitaDesiredAvailability,
      kitaName,
      createdAt,
      consentedAt,
    } = req.body;
    const newNotification = new SingleKitaNotificationValidator();
    newNotification.email = email;
    newNotification.consentId = consentId;
    newNotification.kitaId = kitaId;
    newNotification.kitaDesiredAvailability = kitaDesiredAvailability;
    newNotification.kitaName = kitaName;
    newNotification.createdAt = createdAt;
    newNotification.consentedAt = consentedAt;

    const errors = await validate(newNotification);
    if (errors.length) return res.status(400).json({ error: errors });
    console.log("Validator!!!");

    return next();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const handler: RequestHandler<ISingleKitaNotification> = async (req, res) => {
  try {
    const {
      email,
      consentId,
      kitaId,
      kitaDesiredAvailability,
      kitaName,
      createdAt,
      consentedAt,
    } = req.body;

    console.log("Writing to db!!!");

    await EmailSignup.singleKitaNotificationSignup(
      email,
      consentId,
      kitaId,
      kitaDesiredAvailability,
      kitaName,
      createdAt,
      consentedAt
    );

    return res.status(200).send();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
