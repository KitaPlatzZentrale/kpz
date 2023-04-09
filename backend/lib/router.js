"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/kitas', (req, res) => {
    res.send(req.body);
});
//# sourceMappingURL=router.js.map