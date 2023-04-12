require("dotenv").config();
import mongoose, { ConnectOptions } from "mongoose";

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
      .then(() => console.log("MongoDB connected!"))
      .catch((err: any) => console.log(`MongoDB connection error: ${err}`));
  } catch (err) {
    console.log(err);
  }
}

export async function closeDatabaseConnection() {
  try {
    await mongoose.connection
      .close()
      .then(() => {
        console.log("MongoDB connection closed");
      })
      .catch((error: any) => {
        console.log("Error while closing MongoDB connection:", error);
      });
  } catch (err) {
    console.log(err);
  }
}
