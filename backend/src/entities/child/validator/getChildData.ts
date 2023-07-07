import { IsNotEmpty, IsString, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
import { IGetChildData } from "../types";

class GetChildDataValidator {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export const validator: RequestHandler<any, any, IGetChildData> = async (
  req,
  res,
  next
) => {
  try {
    const validator = new GetChildDataValidator();
    validator.id = req.params.id;
    const errors = await validate(validator);
    if (errors.length) return res.status(400).json({ error: errors });
    return next();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};
