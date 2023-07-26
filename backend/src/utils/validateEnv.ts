const requiredEnvVariables = [
  "AWS_KMS_KEY_ID",
  "API_KEY",
  "AUTH_KEY",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "MONGO_DB_CONNECTION",
];

export const checkIfAllEnvVariablesAreSet = () => {
  for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }
};
