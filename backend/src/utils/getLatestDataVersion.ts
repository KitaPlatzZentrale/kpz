import KitaDetailModel from "../entities/kitas/model";

async function getLatestDataVersion() {
  try {
    const latestVersionDoc = await KitaDetailModel.findOne(
      {},
      {},
      { sort: { version: -1 } }
    ).lean();
    if (!latestVersionDoc) {
      return "0";
    }
    return latestVersionDoc.version;
  } catch (error) {
    console.error("Error fetching latest version:", error);
    throw error;
  }
}

export default getLatestDataVersion;
