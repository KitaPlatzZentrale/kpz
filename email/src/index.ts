import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json()); // Add this line to parse incoming JSON data

const PORT = 3000;

app.use(routes);
app.listen(PORT, () => {
  console.log(`Location service is running on port ${PORT}`);
});
