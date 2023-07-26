import express = require("express");
import { validator as getPaginatedKitasValidator } from "./validator";
import getPaginatedKitas from "./handler";

const router = express.Router();

router.get(
  "/location-service/:lat/:lng/:radius/:page?/:limit?",
  getPaginatedKitasValidator,
  getPaginatedKitas
);

export = router;
