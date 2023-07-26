import { connectToDatabase } from "./database";
import KitaScraper from "./service";

async function runScraper() {
  try {
    // Ensure the database connection
    await connectToDatabase();

    // Run the scraper logic
    await KitaScraper.saveNewKitaDetailVersionToDB();
    console.log("Scraper executed successfully!");
  } catch (error) {
    console.error("Error running scraper:", error);
    process.exit(1); // Exit the process with an error code
  }
}

runScraper();
