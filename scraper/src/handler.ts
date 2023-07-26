import { Request, RequestHandler, Response } from "express";
import KitaScraper from "./service";
import logger from "./logger";

/**
 * Request handler for updating kitas if required.
 *
 * @param req - The request object containing the necessary headers.
 * @param res - The response object used to send the response.
 *
 * @returns A response indicating the success or failure of the update operation.
 */
export const handler: RequestHandler<any, any> = async (
  req: Request,
  res: Response
) => {
  try {
    // check if x-api-key is set
    if (!req.headers["x-api-key"]) {
      return res.status(401).json({ message: "No API key provided" });
    }
    // check if x-api-key is correct
    if (req.headers["x-api-key"] !== process.env.API_KEY) {
      return res.status(401).json({ message: "Wrong API key provided" });
    }
    const updateForKitaDetailRequired =
      await KitaScraper.checkIfKitaDetailVersionNeedsUpdate();
    if (updateForKitaDetailRequired) {
      await KitaScraper.saveNewKitaDetailVersionToDB();
      return res.status(200).json({ message: "Kitas updated" });
    }
    return res.status(200).json({ message: "Kitas already up to date" });
  } catch (err) {
    logger.error("Something went wrong:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;
