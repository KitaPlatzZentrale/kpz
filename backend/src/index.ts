import express = require('express');
import routes = require('./routes');
import cors from 'cors';
import logger from './logger';
const mongoose = require('mongoose');

const app = express();

require("dotenv").config();

app.use(cors())
app.use(express.json());

app.use("", routes);

const dbUrl = 'mongodb+srv://kpz-dev:Nix123456@kitaplatzzentralecluste.dz80v4r.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch((err: any) => console.log(`MongoDB connection error: ${err}`));


app.listen(3000, () => {
  logger.info("Server started on port 3000");
});
