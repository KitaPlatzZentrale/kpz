import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const retentionPeriodHandler = async () => {
  try {
    const url = process.env.API_URL;
    if (!url) throw new Error("No API_URL");
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) throw new Error("API_KEY environment variable not found");

    const API_URL = process.env.API_URL;
    if (!API_URL) throw new Error("API_URL environment variable not found");

    const headers = {
      "x-api-key": API_KEY,
    };
    const response = await axios.delete(url + "/retention-period", { headers });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("An error occurred during execution", error);
  }
};
