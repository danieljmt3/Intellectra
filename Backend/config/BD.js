import mongoose from "mongoose";
import { cluster } from "./config.js";

const mongooconnect = async () => {
  try {
    await mongoose.connect(cluster,{dbName:"Intellectra"});
    console.log("Conexión a la nube lista en Intellectra DB");
  } catch (error) {
    console.log("No se pudo conectar:", error.message);
    process.exit(1);
  }
};

export default mongooconnect;
