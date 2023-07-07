import { RequestHandler } from "express";
import logger from "../../../logger";
import { EmailSignup } from "../service";
/**
 * Request handler for signing up for the Kita Finder service.
 *
 * @param req - The request object containing the signup details in the `req.body`.
 * @param res - The response object.
 * @returns A response indicating success or an error message.
 */
const handler: RequestHandler<IKitaFinderServiceSignup> = async (req, res) => {
  try {
    await EmailSignup.kitaFinderServiceSignup(req.body);

    return res.status(200).send();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
