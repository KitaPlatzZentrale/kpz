import { IsEmail, IsNotEmpty, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
import { IUserParams } from "../types";

class DeleteUserValidator {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export const validator: RequestHandler<any, any, IUserParams> = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.params;
    const newUser = new DeleteUserValidator();
    newUser.email = email;
    const errors = await validate(newUser);
    if (errors.length) return res.status(400).json({ error: errors });
    return next();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};
