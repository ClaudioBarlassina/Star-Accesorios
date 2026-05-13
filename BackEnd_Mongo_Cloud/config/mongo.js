import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    await mongoose.connect(uri, {
      dbName: dbName,
    });

    console.log("MongoDB conectado");

  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};