import { RequestHandler } from "express";
import logger from "../../../logger";
import ChildDataService from "../service";
import { IGetChildData } from "../types";

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
