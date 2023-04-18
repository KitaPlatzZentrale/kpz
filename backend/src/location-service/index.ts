import haversine from "haversine-distance";
import logger from "../services/logger";
import { Kita } from "../types";
import { NextFunction } from "express";

require("dotenv").config();

const axios = require("axios");

export async function locationService(req: any, res: any, next: NextFunction) {
  try {
    const { lat, lon, page, size} = req.params;
    const radius = req.params.radius || 2.5;

    const S3_BUCKET = process.env.S3_BUCKET;

    if (!S3_BUCKET) {
      throw "\n\n\nYOU NEED TO ADD THE S3_BUCKET STRING TO YOUR .env FILE IN THE ROOT FOLDER\n\n\n";
    }
    let kitaList = await axios.get(S3_BUCKET);
    let kitasInRadius: Kita[] = [];
    kitaList.data.map((kita: Kita) => {
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
    const sortedKitaList = sortKitaListByDistance(kitaList)
    const BACKEND_URL = process.env.VITE_BACKEND_URL
    if (!BACKEND_URL) {
      throw "\n\n\nYOU NEED TO ADD THE BACKEND_URL STRING TO YOUR .env FILE IN THE ROOT FOLDER\n\n\n";
    }
    const linkToNextPage = `${BACKEND_URL}/location-service/${lat}/${lon}/${radius}/${page+1}/${size}`

    const paginatedKitas = pagination(sortedKitaList, page, size, linkToNextPage)
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
  return kitaList
}

function pagination(sortedKitaList: Kita[], page: number, size: number, linkToNextPage: string) {
  const startIndex = page * size
  const endIndex = (page * size) + size
  let kitasInPage;
  if(endIndex > sortedKitaList.length) {
    kitasInPage = sortedKitaList.slice(startIndex, endIndex)
  }
  else {
    kitasInPage = sortedKitaList.slice(startIndex)
  }
  const maxNumOfPages = Math.round(sortedKitaList.length / size)
  let pagesLeft = maxNumOfPages - page
  return {
    metadata: {
      currentPage: page,
      totalKitas: sortedKitaList.length,
      returnedKitas: kitasInPage.length,
      pagesLeft: pagesLeft,
      linkToNextPage: linkToNextPage
    },
    kitas: kitasInPage,
  }
}