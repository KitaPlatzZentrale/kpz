import express = require("express");
import routes = require("./routes");
import cors from "cors";
import logger from "./logger";
import { connectToDatabase } from "./database";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("", routes);

connectToDatabase();

app.listen(process.env.PORT, () => {
  logger.info(`Server started on port ${process.env.PORT}`);
});
