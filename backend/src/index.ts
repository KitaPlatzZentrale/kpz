import express = require("express");
import routes = require("./routes");
import cors from "cors";
import logger from "./logger";
import { connectToDatabase } from "./database";

const app = express();

app.use(cors());
app.use(express.json());

app.use("", routes);

connectToDatabase();

app.listen(3000, () => {
  logger.info("Server started on port 3000");
});
