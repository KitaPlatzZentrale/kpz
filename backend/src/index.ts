import express = require("express");
import routes = require("./routes");
const app = express();

require("dotenv").config();

app.use(express.json());

// Endpoint to consume LAT/LONG
// Request Berlin API for Kitas in Radius
// Transform JSON into our Schema ( English, Full URL for image)
// Return Kitas in Radius

// Endpoint to consume Kita ID
// Transform JSON into our Schema ( English, Full URL for image)
// Save Kita in DB
// Request Berlin API for specific Kita

app.use("", routes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
