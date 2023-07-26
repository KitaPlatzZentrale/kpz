import express = require("express");
import scrapeNewKitaData from "./handler";

const router = express.Router();

router.get("/scrape", scrapeNewKitaData);

export = router;
