import { RequestHandler } from "express";
import logger from "../../../logger";
import User from "../service";
import { IUserParams } from "../types";

const handler: RequestHandler<any, any, IUserParams> = async (req, res) => {
  try {
    const { email } = req.params;
    await User.deleteUser({ email });
    return res.status(200).send();
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Something went wrong");
  }
};

export default handler;
