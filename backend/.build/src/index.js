"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const serverless = require("serverless-http");
const app = express();
// Endpoint to consume LAT/LONG
// Request Berlin API for Kitas in Radius
// Transform JSON into our Schema ( English, Full URL for image)
// Return Kitas in Radius
// Endpoint to consume Kita ID
// Transform JSON into our Schema ( English, Full URL for image)
// Save Kita in DB
// Request Berlin API for specific Kita
app.get("/", (req, res) => {
    res.send("Hello World!");
});
module.exports.handler = serverless(app);
//# sourceMappingURL=index.js.map