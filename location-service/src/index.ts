import { connectToDatabase } from "./database";
import KitaService from "./service";
import type { Handler } from "aws-lambda";

/**
 * Request handler for retrieving paginated kitas within a specified radius.
 *
 * @param event - The event object containing the request parameters.
 * @param ctx - The context object provided by AWS Lambda.
 * @returns A response containing the paginated kitas or an error message.
 */
const handler: Handler = async (event: any, ctx) => {
  try {
    connectToDatabase();

    // Extracting parameters from the path
    const pathParameters = event.pathParameters;
    if (!pathParameters) {
      throw new Error("Path parameters not found.");
    }

    // Parsing parameters from the path
    const lat = Number(pathParameters.lat);
    const lng = Number(pathParameters.lng);
    const radius = Number(pathParameters.radius || 2500);
    const page = Number(pathParameters.page || 1);
    const limit = Number(pathParameters.limit || 50);

    const paginatedKitas = await KitaService.getKitasInRadius(
      lat,
      lng,
      radius,
      page,
      limit
    );

    return paginatedKitas;
  } catch (err: any) {
    console.error(err);
    return "Something went wrong. Please try again later.";
  }
};

export default handler;
