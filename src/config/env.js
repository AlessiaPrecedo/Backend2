import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error("The MONGO_URL variable is missing from the .env file.");
}

export const env = {
  PORT: process.env.PORT || 8080,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  NODE_ENV: process.env.NODE_ENV || "development",
};
