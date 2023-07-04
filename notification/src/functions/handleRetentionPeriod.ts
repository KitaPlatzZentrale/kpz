import { Handler } from "aws-lambda";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const handler: Handler = async (event, context) => {
  try {
    const url = process.env.API_URL;
    if (!url) throw new Error("No API_URL");
    const response = await axios.delete(url + "/retention-period");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("An error occurred during execution", error);
  }
};
