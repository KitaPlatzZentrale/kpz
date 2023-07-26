import logger from "./logger";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function connectToDatabase() {
  try {
    const dbUrl = process.env.MONGO_DB_CONNECTION;
    if (!dbUrl) {
      throw "\n\n\nYOU NEED TO ADD THE MONGO_DB_CONNECTION STRING INTO YOUR .env FILE IN THE ROOT DIRECTORY\n\n\n";
    }
    mongoose
      .connect(dbUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as ConnectOptions)
      .then(() => logger.info("MongoDB connected!"))
      .catch((err: any) => logger.error(`MongoDB connection error: ${err}`));
  } catch (err) {
    logger.error(err);
  }
}

export async function closeDatabaseConnection() {
  try {
    await mongoose.connection
      .close()
      .then(() => {
        logger.info("MongoDB connection closed");
      })
      .catch((error: any) => {
        logger.error("Error while closing MongoDB connection:", error);
      });
  } catch (err) {
    logger.error(err);
  }
}
