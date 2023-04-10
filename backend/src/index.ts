import express = require('express');
import routes = require('./routes');
import cors from 'cors';

const app = express();

require("dotenv").config();

app.use(cors())
app.use(express.json());

app.use("", routes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
