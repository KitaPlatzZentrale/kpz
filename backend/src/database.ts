import logger from "./logger";
import mongoose, { ConnectOptions } from "mongoose";

export async function connectToDatabase() {
  try {
    // Reuse existing connection in Lambda warm starts
    // Mongoose maintains connection state internally
    if (mongoose.connection.readyState === 1) {
      logger.info("MongoDB connection already established (reusing existing connection)");
      return;
    }

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
