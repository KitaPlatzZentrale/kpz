import express = require("express");

import einzelBenachrichtigungHandler from "./anmeldungen/einzel";
import arealBenachrichtigungHandler from "./anmeldungen/areal";
import serviceAnmeldungHandler from "./anmeldungen/service";

import { kitaList, kitaDetail } from "./controller";
const router = express.Router();
const axios = require("axios");

router.get("/kitas", async (req, res) => {
  try {
    let kitas = await axios.get(
      "https://kita-navigator.berlin.de/api/v1/kitas/umkreissuche?entfernung=500&seite=0&max=2"
    );
    const result = kitaList(kitas.data);
    res.send(result);
  } catch (err: any) {
    console.log(err.message);
  }
});

router.get("/kita/:uuid", async (req, res) => {
  try {
    let kita = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${req.params.uuid}`
    );
    console.log(kita.data);
    const result = kitaDetail(kita.data);
    res.send(result);
  } catch (err: any) {
    console.log(err.message);
  } catch (err: any) {
    console.log(err.message);
  }
});

router.post("/anmeldungen/service", serviceAnmeldungHandler);
router.post("/anmeldungen/einzel", einzelBenachrichtigungHandler);
router.post("/anmeldungen/areal", arealBenachrichtigungHandler);

export = router;
