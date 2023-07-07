const requiredEnvVariables = [
  "AWS_KMS_KEY_ID",
  "CURRENT_KITA_DATA_VERSION",
  "API_KEY",
  "AUTH_KEY",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "KITA_API_URL",
  "MONGO_DB_CONNECTION",
];

export const checkIfAllEnvVariablesAreSet = () => {
  for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }
};
