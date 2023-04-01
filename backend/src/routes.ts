import express = require('express');
import { translateKitalistJson, kitaDetail } from './controller';
const router = express.Router();
const axios = require('axios');

router.get('/kitas', async (req, res) => {
  try {
    let kitas = await axios.get(
      'https://kita-navigator.berlin.de/api/v1/kitas/umkreissuche?entfernung=500&seite=0&max=2'
    );
    console.log(kitas.data);
    const result = translateKitalistJson(kitas.data);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
});

router.get('/kita/:uuid', async (req, res) => {
  try {
    let kita = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${req.params.uuid}`
    );
    console.log(kita.data);
    const result = kitaDetail(kita.data);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
});

export = router;


