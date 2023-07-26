import express from "express";
import routes from "./routes";
import { connectToDatabase } from "./database";

const app = express();
const PORT = 3000;

connectToDatabase();
app.use(routes);
app.listen(PORT, () => {
  console.log(`Location service is running on port ${PORT}`);
});
