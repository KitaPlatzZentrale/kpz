import { IsNotEmpty, IsString, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
import { IChildData } from "../types";

class ChildDataValidator {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  parentId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  actualOrExpectedBirthMonth: string;

  @IsString()
  @IsNotEmpty()
  desiredStartingMonth: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  careHours: string[];
}

export const validator: RequestHandler<any, any, IChildData> = async (
  req,
  res,
  next
) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    const {
      id,
      parentId,
      firstName,
      lastName,
      gender,
      actualOrExpectedBirthMonth,
      desiredStartingMonth,
      careHours,
    } = req.body;
    const newChildData = new ChildDataValidator();
    newChildData.id = id;
    newChildData.parentId = parentId;
    newChildData.firstName = firstName;
    newChildData.lastName = lastName;
    newChildData.gender = gender;
    newChildData.actualOrExpectedBirthMonth = actualOrExpectedBirthMonth;
    newChildData.desiredStartingMonth = desiredStartingMonth;
    newChildData.careHours = careHours;
    const errors = await validate(newChildData);
    if (errors.length) return res.status(400).json({ error: errors });
    return next();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};
