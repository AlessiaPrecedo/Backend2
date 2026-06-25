import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error("Falta la variable MONGO_URL en el .env");
}

export const env = {
  PORT: process.env.PORT || 8080,
  MONGO_URL: process.env.MONGO_URL,
};
