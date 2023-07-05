import { IsNotEmpty, IsString, validate } from "class-validator";
import { RequestHandler } from "express";
import logger from "../../../logger";
import ChildDataService from "../service";

interface IGetChildData {
  id: string;
}

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

const handler: RequestHandler<any, any, IGetChildData> = async (req, res) => {
  try {
    const { id } = req.params;
    const childDataService = new ChildDataService();
    const childData = await childDataService.getChildData(id);
    if (!childData) {
      return res.status(404).json({ error: "Child data not found" });
    }
    return res.status(200).json(childData);
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
