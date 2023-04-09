import express = require('express');
import routes = require('./routes');
import cors from 'cors';
import logger from './logger';

const app = express();

require("dotenv").config();

app.use(cors())
app.use(express.json());

app.use("", routes);

app.listen(3000, () => {
  logger.info("Server started on port 3000");
});
