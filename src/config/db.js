import mongoose from "mongoose";
import { env } from "./env.js";
export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URL);
    console.log("BConnected database");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
