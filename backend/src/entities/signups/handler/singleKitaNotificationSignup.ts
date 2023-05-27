import { RequestHandler } from "express";
import { IsEmail, IsNotEmpty, IsString, validate } from "class-validator";
import logger from "../../../logger";
import { EmailSignup } from "../service";

interface ISingleKitaNotification {
  email: string;
  kitaId: string;
  kitaName: string;
  kitaDesiredAvailability: string;
}

class SingleKitaNotificationValidator {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  kitaId: string;

  @IsString()
  @IsNotEmpty()
  kitaName: string;

  @IsString()
  @IsNotEmpty()
  kitaDesiredAvailability: string;
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
    const { email, kitaId, kitaDesiredAvailability, kitaName } = req.body;
    const newNotification = new SingleKitaNotificationValidator();
    newNotification.email = email;
    newNotification.kitaId = kitaId;
    newNotification.kitaDesiredAvailability = kitaDesiredAvailability;
    newNotification.kitaName = kitaName;

    const errors = await validate(newNotification);
    if (errors.length) return res.status(400).json({ error: errors });

    return next();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const handler: RequestHandler<ISingleKitaNotification> = async (req, res) => {
  try {
    const { email, kitaId, kitaDesiredAvailability, kitaName } = req.body;

    await EmailSignup.singleKitaNotificationSignup(
      email,
      kitaId,
      kitaDesiredAvailability,
      kitaName
    );

    return res.status(200).send();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
