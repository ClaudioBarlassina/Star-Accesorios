import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    console.log("🔌 Intentando conectar a MongoDB...");
    console.log("🌐 URI:", uri.replace(/\/\/(.*):(.*)@/, "//****:****@")); // oculta credenciales
    console.log("📂 DB objetivo:", dbName);

      await mongoose.connect(uri, {
      dbName: dbName,
    });

    console.log("✅ MongoDB conectado");
    console.log("📂 Base de datos:", mongoose.connection.name);
    console.log("📂 Collections:", mongoose.connection.models);
    console.log("🧠 Host:", mongoose.connection.host);
    console.log("📡 Estado:", mongoose.connection.readyState); // 1 = conectado

  } catch (error) {
    console.error("❌ Error conectando a MongoDB");
    console.error("📛 Mensaje:", error.message);
    console.error("📌 Código:", error.code);
    console.error("📚 Stack:", error.stack);

    process.exit(1);
  }
};