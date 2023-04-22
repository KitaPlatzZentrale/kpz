import { RequestHandler } from "express";
import AirtableAPIService, {
  CreateEinzelbenachrichtigungPayload,
} from "../service";

const handler: RequestHandler<
  any,
  any,
  CreateEinzelbenachrichtigungPayload
> = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, interneKitaId, kitaName, name } = req.body;

    const airtableApi = new AirtableAPIService();

    const anmeldung = await airtableApi.createEinzelbenachrichtigung({
      email,
      interneKitaId,
      kitaName,
      name,
    });

    return !!anmeldung
      ? res.status(200).json({ success: !!anmeldung })
      : res
          .status(500)
          .json({ error: "Creation of Einzelbenachrichtigung failed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
