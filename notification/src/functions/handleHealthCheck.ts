import { Handler } from "aws-lambda";
import axios from "axios";
import { sendSNS, setupSNS } from "../sender/sendSNS";

export const handler: Handler = async (event, context) => {
  const SNS = setupSNS();
  try {
    // GET https://api.kitaplatz-zentrale.de/health using axios
    const res = await axios.get("https://api.kitaplatz-zentrale.de/health");
    if (res.status === 200) {
      console.log("Health check success");
    } else {
      console.log("Health check failed");
      sendSNS(SNS);

      return;
    }
  } catch (error) {
    console.log(error);
    sendSNS(SNS);
    throw error;
  }
};
