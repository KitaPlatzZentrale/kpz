import express = require("express");
import serverless = require("serverless-http");
import routes = require("./routes");
const app = express();

require("dotenv").config();

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
