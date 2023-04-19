import haversine from "haversine-distance";
import logger from "../services/logger";
import { Kita } from "../types";
import { NextFunction } from "express";
import { connectToDatabase } from "../services/database";
import { KitaDetailModel } from "../models";

require("dotenv").config();

export async function locationService(req: any, res: any, next: NextFunction) {
  try {
    const { lat, lon } = req.params;
    const radius = req.params.radius || 2.5;
    const page = parseInt(req.params.page);
    const size = parseInt(req.params.size);

    await connectToDatabase();
    const kitaList = await KitaDetailModel.find();
    console.log(kitaList.length);

    let kitasInRadius: Kita[] = [];
    kitaList.map((kita: Kita) => {
      const distance =
        haversine(
          { lat, lon },
          { lat: kita.coordinates.lat, lon: kita.coordinates.lng }
        ) / 1000;
      if (distance <= radius) {
        kita.coordinates.dist = distance;
        kitasInRadius.push(kita);
      }
    });
    console.log(kitasInRadius);
    const sortedKitaList = sortKitaListByDistance(kitasInRadius);
    const BACKEND_URL = process.env.VITE_BACKEND_URL;
    if (!BACKEND_URL) {
      throw "\n\n\nYOU NEED TO ADD THE VITE_BACKEND_URL STRING TO YOUR .env FILE IN THE ROOT FOLDER\n\n\n";
    }
    const linkToNextPage = `${BACKEND_URL}/location-service/${lat}/${lon}/${radius}/${
      page + 1
    }/${size}`;

    const paginatedKitas = pagination(
      sortedKitaList,
      page,
      size,
      linkToNextPage
    );
    if (paginatedKitas.metadata.pagesLeft === 0) {
      paginatedKitas.metadata.nextUrl = false;
    }
    logger.info(`Found ${kitasInRadius.length} Kitas in radius of ${radius}km`);
    return res.send(paginatedKitas);
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

function sortKitaListByDistance(kitaList: Kita[]) {
  kitaList.sort((a, b) => {
    return a.coordinates.dist - b.coordinates.dist;
  });
  return kitaList;
}

function pagination(
  sortedList: any[],
  page: number,
  size: number,
  linkToNextPage: string
) {
  const startIndex = page * size;
  const endIndex = page * size + size;
  let itemsInPage;
  if (endIndex > sortedList.length) {
    itemsInPage = sortedList.slice(startIndex);
  } else {
    itemsInPage = sortedList.slice(startIndex, endIndex);
  }
  const maxNumOfPages = Math.ceil(sortedList.length / size);
  const pagesLeft = maxNumOfPages - page;
  return {
    metadata: {
      page: page,
      amountOfItems: sortedList.length,
      totalPages: maxNumOfPages - 1,
      itemsPerPage: size,
      returnedItems: itemsInPage.length,
      pagesLeft: pagesLeft - 1,
      nextUrl: <string | boolean>linkToNextPage,
    },
    items: itemsInPage,
  };
}
