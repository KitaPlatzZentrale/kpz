import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  validate,
} from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";

class AreaNotificationSignupValidator {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  areaDescription: string;

  @IsOptional()
  @IsDateString()
  revokedAt: string | null;
}

export const validator: RequestHandler<IAreaNotificationSignup> = async (
  req,
  res,
  next
) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, areaDescription, revokedAt } = req.body;
    const newAreaNotification = new AreaNotificationSignupValidator();
    newAreaNotification.areaDescription = areaDescription;
    newAreaNotification.email = email;
    newAreaNotification.revokedAt = revokedAt;
    const errors = await validate(newAreaNotification);
    if (errors.length) return res.status(400).json({ error: errors });
    return next();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};
