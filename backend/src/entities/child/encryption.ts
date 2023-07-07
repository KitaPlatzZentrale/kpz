/**
 * MongoDB Client Encryption Utility
 * Provides functions for managing data keys and encryption/decryption.
 */

import { MongoClient } from "mongodb";
import { ClientEncryption } from "mongodb-client-encryption";

/**
 * The AWS Key Management Service (KMS) key ID used for encryption.
 */
const awsKmsKeyId = process.env.AWS_KMS_KEY_ID;

/**
 * The AWS access key ID and secret access key for authentication.
 */
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

/**
 * The options for configuring the data key.
 */
export const dataKeyOptions = {
  masterKey: {
    provider: "aws",
    key: awsKmsKeyId,
    region: "eu-central-1",
  },
};

/**
 * The MongoDB client used for encryption/decryption.
 */
const client = new MongoClient(process.env.MONGO_DB_CONNECTION);

/**
 * The MongoDB Client Encryption instance.
 */
const encryption = new ClientEncryption(client, {
  keyVaultNamespace: "test.keyVault",
  kmsProviders: {
    aws: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  },
});

/**
 * Creates a unique data key for a specified user.
 *
 * @param userId - The ID of the user.
 * @returns The ID of the created data key.
 */
const createDataKey = async (userId: string) => {
  const dataKeyId = await encryption.createDataKey("aws", dataKeyOptions);
  const keyVaultCollection = client.db("test").collection("keyVault");
  await keyVaultCollection.updateOne(
    { _id: dataKeyId },
    { $set: { keyAltNames: [userId] } }
  );
  return dataKeyId;
};

/**
 * Retrieves the data key for a specific user.
 *
 * @param userId - The ID of the user.
 * @returns The binary data key ID.
 * @throws Error if no data key is found for the specified user.
 */
const getDataKey = async (userId: string) => {
  const keyVaultCollection = client.db("test").collection("keyVault");
  const keyVaultDocument = await keyVaultCollection.findOne({
    keyAltNames: { $in: [userId] },
  });
  if (!keyVaultDocument) {
    throw new Error("No data key found for the specified user");
  }

  const binaryDataKeyId = keyVaultDocument._id;
  return binaryDataKeyId;
};

export { encryption, createDataKey, getDataKey };
