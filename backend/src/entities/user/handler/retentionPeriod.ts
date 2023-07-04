import { RequestHandler } from "express";
import logger from "../../../logger";
import User from "../service";

const handler: RequestHandler<any, any> = async (req, res) => {
  try {
    await User.deleteOutdatedUserData();
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
