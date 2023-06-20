const { MongoClient } = require("mongodb");
const { ClientEncryption } = require("mongodb-client-encryption");
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

const dataKeyOptions = {
  masterKey: {
    provider: "aws",
    key: awsKmsKeyId,
    region: "eu-central-1",
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
};

const encryption = new ClientEncryption(MongoClient, {
  keyVaultNamespace: "test.childData",
  kmsProviders: {
    aws: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  },
});

const dataKeyId = encryption.createDataKey("aws", dataKeyOptions);

export { dataKeyId, encryption };
