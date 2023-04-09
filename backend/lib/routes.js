"use strict";
const express = require("express");
const controller_1 = require("./controller");
const router = express.Router();
const axios = require('axios');
router.get('/kitas', async (req, res) => {
    try {
        let kitas = await axios.get('https://kita-navigator.berlin.de/api/v1/kitas/umkreissuche?entfernung=500&seite=0&max=5000');
        console.log(kitas.data);
        const result = (0, controller_1.translateKitalistJson)(kitas.data);
        res.send(result);
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = router;
//# sourceMappingURL=routes.js.map