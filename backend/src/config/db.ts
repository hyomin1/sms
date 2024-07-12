// src/config/database.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
