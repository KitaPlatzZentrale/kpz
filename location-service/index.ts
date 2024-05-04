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

interface IRequestData {
  lat: string;
  lng: string;
  radius?: string;
  page?: string;
  limit?: string;
}

export const handler: Handler = async (event: any, ctx) => {
  try {
    connectToDatabase();
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Parse the JSON string in event.body to an object
    const requestBody = JSON.parse(event.body);

    if (!requestBody) {
      return "Invalid request body.";
    }

    const { lat, lng, radius, page, limit } = requestBody;
    console.log(
      "lat:",
      lat,
      "lng:",
      lng,
      "radius:",
      radius,
      "page:",
      page,
      "limit:",
      limit
    );

    // Parsing parameters from the request body with default values if not provided
    const latNumber = Number(lat);
    const lngNumber = Number(lng);
    const radiusNumber = Number(radius || 2500);
    const pageNumber = Number(page || 1);
    const limitNumber = Number(limit || 50);

    if (
      isNaN(latNumber) ||
      isNaN(lngNumber) ||
      latNumber === 0 ||
      lngNumber === 0
    ) {
      return "Invalid latitude or longitude provided.";
    }

    const paginatedKitas = await KitaService.getKitasInRadius(
      latNumber,
      lngNumber,
      radiusNumber,
      pageNumber,
      limitNumber
    );

    return paginatedKitas;
  } catch (err: any) {
    console.error(err);
    return "Something went wrong. Please try again later.";
  }
};
