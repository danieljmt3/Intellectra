import mongoose from "mongoose";
import { cluster } from "./config.js";

const mongooconnect = async () => {
  try {
    await mongoose.connect(cluster);
    console.log("Conexión a la nube lista");
  } catch (error) {
    console.log("No se pudo conectar:", error.message);
    process.exit(1);
  }
};

export default mongooconnect;
