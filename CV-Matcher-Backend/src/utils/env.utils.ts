import dotenv from "dotenv";
dotenv.config();

function isEnvExists(key: string) {
  return Object.prototype.hasOwnProperty.call(process.env, key);
}

function getEnvValue(key: string) {
  return isEnvExists(key) ? process.env[key] : null;
}

export { getEnvValue };
