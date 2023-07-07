import { RequestHandler } from "express";
import logger from "../../../logger";
import ChildDataService from "../service";
import { IChildData } from "../types";

const handler: RequestHandler<any, any, IChildData> = async (req, res) => {
  try {
    const childData = req.body;
    const childDataService = new ChildDataService();
    await childDataService.saveChildData(childData);
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
