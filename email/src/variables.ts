import dotenv from "dotenv";

dotenv.config();

export const BASE_URL =
  process.env.FRONTEND_URL ?? "https://kitaplatz-zentrale.de";

export const BROWSE_KITAS_ENDPOINT = `${BASE_URL}/kitas`;
export const REVOKE_CONSENT_ENDPOINT = `${BASE_URL}/email-optout`;
