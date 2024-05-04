import KitaScraper from "./service";
import type { Handler } from "aws-lambda";
import { connectToDatabase } from "./database";
/**
 * Request handler for updating kitas if required.
 * @returns A response indicating the success or failure of the update operation.
 */
export const handler: Handler = async (event, ctx) => {
  try {
    connectToDatabase();
    await KitaScraper.updateKitaDetails();
    console.log("Kitas updated");
    return "Kitas updated";
  } catch (err) {
    console.error("Something went wrong:", err);
    return "Something went wrong";
  }
};
