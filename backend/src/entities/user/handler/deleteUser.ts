import { IsEmail, IsNotEmpty, IsString, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
import User from "../service";

interface IUserParams {
  email: string;
  parentId: string;
}

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

const handler: RequestHandler<any, any, IUserParams> = async (req, res) => {
  try {
    const { email } = req.params;
    await User.deleteUser({ email });
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
