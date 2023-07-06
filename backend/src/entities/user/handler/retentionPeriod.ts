import { RequestHandler } from "express";
import logger from "../../../logger";
import User from "../service";

const handler: RequestHandler<any, any> = async (req, res) => {
  try {
    // check if x-api-key is set
    if (!req.headers["x-api-key"]) {
      return res.status(401).json({ message: "No API key provided" });
    }
    // check if x-api-key is correct
    if (req.headers["x-api-key"] !== process.env.API_KEY) {
      return res.status(401).json({ message: "Wrong API key provided" });
    }
    await User.deleteOutdatedUserData();
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
