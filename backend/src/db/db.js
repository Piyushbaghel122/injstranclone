import mongoose from "mongoose";

export default async function connectDB() {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/instagramclone";

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to database");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}
