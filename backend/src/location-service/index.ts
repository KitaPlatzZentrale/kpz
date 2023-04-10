import { validate } from 'class-validator';
import { NextFunction } from 'express';
import haversine from 'haversine-distance';
import { Kita } from '../type';
import { LocationValidator } from './validator';

const axios = require("axios");

export async function locationService(req: any, res: any, next: NextFunction) {
  try {
    const newLocation = new LocationValidator();
    newLocation.lat = req.body.lat
    newLocation.lon = req.body.lon
    
    const errors = await validate(newLocation)
    if (errors.length) {
      res.status(400).json({ error: errors})
    }
    const {lat, lon} = req.body
    // 1. Get the Kita List
    let kitaList = await axios.get('https://kpzbucket.s3.eu-central-1.amazonaws.com/kitas_berlin.json')
    console.log(kitaList.data.length)
    // 2. Calculate the distance
    kitaList.data.map((kita: Kita) => {
      kita.coordinates.dist = haversine({lat, lon}, {lat: kita.coordinates.lat, lon: kita.coordinates.lng}) / 1000
    })
    // 3. Send the Kita List with the distance
    res.send(kitaList.data)
  } catch (err: any) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" });
  }
}
