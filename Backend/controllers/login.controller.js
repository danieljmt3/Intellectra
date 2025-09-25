import { crypt, decrypt } from "../middleware/hasspassword.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { JWTSC } from "../config/config.js";



export const registrar = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    //Verificiar que el usuario existe
    const userexist = await userModel.findOne({ email });
    if (userexist) {
      return res.status(400).json({ message: "Usuario existente" });
    }

    //Encriptar contraseña
    const haspasword = await crypt(password);

    //Guardar usuario
    const NewUser = new userModel({
      email,
      name,
      password: haspasword,
    });

    await NewUser.save();
    console.log("Usuario guardado");

    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userexist = await userModel.findOne({ email });

    if (!userexist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordValide = await decrypt(password, userexist.password);

    if (!passwordValide) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const TK = jwt.sign({ id: userexist.id }, JWTSC, { expiresIn: "1h" });

    res.json({ message: "Inicio completado", token: TK });
  } catch (error) {
    console.log("Error al iniciar sesión", error);
  }
};

