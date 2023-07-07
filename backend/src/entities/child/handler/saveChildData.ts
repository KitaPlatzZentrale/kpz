import { RequestHandler } from "express";
import logger from "../../../logger";
import ChildDataService from "../service";
import { IChildData } from "../types";
/**
 * Request handler for saving child data.
 *
 * @param req - The request object containing the child data in the request body.
 * @param res - The response object used to send the response.
 *
 * @returns A response indicating the status of the operation.
 */
const handler: RequestHandler<any, any, IChildData> = async (req, res) => {
  try {
    const childDataService = new ChildDataService();
    await childDataService.saveChildData(req.body);
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
