import { RequestHandler } from "express";
import AirtableAPIService, {
  CreateServiceAnmeldungPayload,
} from "../airtable/AirtableService";

const handler: RequestHandler<any, any, CreateServiceAnmeldungPayload> = async (
  req,
  res
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, vorname, nachname } = req.body;

    const airtableApi = new AirtableAPIService();

    const anmeldung = await airtableApi.createServiceAnmeldung({
      email,
      vorname,
      nachname,
    });

    return !!anmeldung
      ? res.status(200).json({ success: !!anmeldung })
      : res.status(500).json({ error: "Creation of Service Anmeldung failed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
