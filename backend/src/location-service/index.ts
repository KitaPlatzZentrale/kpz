import { NextFunction } from "express";
import haversine from "haversine-distance";
import { Kita } from "../type";

const axios = require("axios");

export async function locationService(req: any, res: any, next: NextFunction) {
  try {
    const { lat, lon } = req.params;
    const radius = req.params.radius || 2.5;

    // 1. Get the Kita List
    let kitaList = await axios.get(
      "https://kpzbucket.s3.eu-central-1.amazonaws.com/kitas_berlin.json"
    );
    // 2. Calculate the distance
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
    // 3. Send the Kita List with the distance
    return res.send(kitasInRadius);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
