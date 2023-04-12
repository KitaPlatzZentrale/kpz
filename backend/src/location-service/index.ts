require("dotenv").config();
import { NextFunction } from "express";
import haversine from "haversine-distance";
import { Kita } from "../types";

const axios = require("axios");

export async function locationService(req: any, res: any, next: NextFunction) {
  try {
    const { lat, lon, radius } = req.body;
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
    return res.send(kitasInRadius);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
