import jwt from "jsonwebtoken";
import { JWTSC } from "../config/config.js";

export function verifyToken(req, res, next) {
  const authTK = req.headers["authorization"];
  console.log(authTK);
  if (!authTK){  console.log("No se recibio token");
   return res.status(401).json({ mensaje: "Token no ha sido enviado" });
  }

  const token = authTK.split(" ")[1];

  if (!token) {
    console.log("Token vacío en el header Authorization");
    return res.status(401).json({ mensaje: "Token no ha sido enviado" });
  }

  try {
    const decoded = jwt.verify(token, JWTSC);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token Invalido o expirado" });
  }
}
