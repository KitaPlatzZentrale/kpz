const requiredEnvVariables = [
  "API_KEY",
  "AUTH_KEY",
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
