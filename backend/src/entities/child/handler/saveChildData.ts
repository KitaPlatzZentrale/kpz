import { IsNotEmpty, IsString, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
import ChildDataService from "../service";

export interface IChildData {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  actualOrExpectedBirthMonth: string;
  desiredStartingMonth: string;
  careHours: string[];
}

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

export const validator: RequestHandler<IChildData> = async (req, res, next) => {
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

const handler: RequestHandler<IChildData> = async (req, res) => {
  try {
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
    // Handle the child data, e.g., save it to the database
    const childDataService = new ChildDataService();
    await childDataService.saveChildData({
      id,
      parentId,
      firstName,
      lastName,
      gender,
      actualOrExpectedBirthMonth,
      desiredStartingMonth,
      careHours,
    });
    // Send a response
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
