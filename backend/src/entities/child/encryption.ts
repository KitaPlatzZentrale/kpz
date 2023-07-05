import { MongoClient } from "mongodb";
import { ClientEncryption } from "mongodb-client-encryption";

import dotenv from "dotenv";

dotenv.config();
if (
  !process.env.AWS_KMS_KEY_ID ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  throw new Error(
    "AWS KMS Key ID, AWS Access Key ID, and AWS Secret Access Key must be defined!"
  );
}
const awsKmsKeyId = process.env.AWS_KMS_KEY_ID;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const dataKeyOptions = {
  masterKey: {
    provider: "aws",
    key: awsKmsKeyId,
    region: "eu-central-1",
  },
};
const client = new MongoClient(process.env.MONGO_DB_CONNECTION);
const encryption = new ClientEncryption(client, {
  keyVaultNamespace: "test.keyVault",
  kmsProviders: {
    aws: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  },
});

// Create unqique data key for each user
const createDataKey = async (userId: string) => {
  const dataKeyId = await encryption.createDataKey("aws", dataKeyOptions);
  const keyVaultCollection = client.db("test").collection("keyVault");
  await keyVaultCollection.updateOne(
    { _id: dataKeyId },
    { $set: { keyAltNames: [userId] } }
  );
  return dataKeyId;
};

// Get data key for a specific user
const getDataKey = async (userId: string) => {
  const keyVaultCollection = client.db("test").collection("keyVault");
  console.log("userId", userId);
  const keyVaultDocument = await keyVaultCollection.findOne({
    keyAltNames: { $in: [userId] },
  });
  console.log("keyVaultDocument", keyVaultDocument);
  if (!keyVaultDocument) {
    throw new Error("No data key found for the specified user");
  }

  const binaryDataKeyId = keyVaultDocument._id;
  return binaryDataKeyId;
};

export { encryption, createDataKey, getDataKey };