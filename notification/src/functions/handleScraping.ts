import { Handler } from "aws-lambda";
import axios from "axios";
import { sendSNS, setupSNS } from "../sender/sendSNS";
import dotenv from "dotenv";
dotenv.config();

export const handler: Handler = async (event, context) => {
  const SNS = setupSNS();
  try {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) throw new Error("API_KEY environment variable not found");

    const API_URL = process.env.API_URL;
    if (!API_URL) throw new Error("API_URL environment variable not found");

    const headers = {
      "x-api-key": API_KEY,
    };

    const res = await axios.get(`${API_URL}/scrape`, { headers });
    if (res.status === 200) {
      console.log("Scraper success");
      return;
    } else {
      console.log("Scraper failed");
      sendSNS(SNS);
      return;
    }
  } catch (error) {
    console.log(error);
    sendSNS(SNS);
    return;
  }
};
