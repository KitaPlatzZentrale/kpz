import { RequestHandler } from "express";
import AirtableAPIService, {
  CreateArealbenachrichtigungPayload,
} from "../service";

const handler: RequestHandler<
  any,
  any,
  CreateArealbenachrichtigungPayload
> = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, name, region } = req.body;

    const airtableApi = new AirtableAPIService();

    const anmeldung = await airtableApi.createArealbenachrichtigung({
      email,
      name,
      region,
    });

    return !!anmeldung
      ? res.status(200).json({ success: !!anmeldung })
      : res
          .status(500)
          .json({ error: "Creation of Arealbenachrichtigung failed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
