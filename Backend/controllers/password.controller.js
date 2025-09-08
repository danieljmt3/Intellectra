import {
  emails,
  JWTSC,
  PassApp,
  production,
  puerto,
} from "../config/config.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import nodemailer from "nodemailer";
import { crypt } from "../middleware/hasspassword.js";
import { getTunnelUrl } from "../middleware/Url.tunnel.js";

export const requestpasswordRest = async (req, res, next) => {
  const { email } = req.body;

  console.log(`Se recibio la solicitud de ${email}`);

  try {
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const secret = JWTSC + userExist.password;
    const Token = jwt.sign(
      { id: userExist._id, email: userExist.email },
      secret,
      { expiresIn: "15m" }
    );
    const host = req.headers.host; // Ej: proudly-quebec-palestine-burst.trycloudflare.com
    const protocol =
      req.headers["x-forwarded-proto"] || req.protocol || "https";
    const tunnelUrl = `${protocol}://${host}`;


    const resetUrl = `${tunnelUrl}/reset-password?id=${userExist._id}&token=${Token}`;
    console.log(resetUrl);

    const trasporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emails,
        pass: PassApp,
      },
    });

    const mailOPtion = {
      to: userExist.email,
      from: emails,
      subject: "Restablecer contraseña",
      text: `Hola ${userExist.name} has enviado una solicitud para restablecer tu contraseña,\n \n
          Por eso te hemos enviado este enlace para que puedas realizar el proceso:\n \n
          ${resetUrl} \n \n
          Si no hiciste esto, por favor ignora este mensaje`,
    };

    await trasporter.sendMail(mailOPtion);

    console.log(`Se envió el correo a ${email}`);
    res.json({ message: "Correo de restablecimiento de contraseña" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al enviar un correo" });
  }
};

export const RestPassword = async (req, res) => {
  const { id, token } = req.query;
  const { NewPassword } = req.body;

  console.log(`Se recibio ${id} - ${token} - ${NewPassword}`);

  try {
    const userExist = await userModel.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const secret = JWTSC + userExist.password;

    jwt.verify(token, secret);

    const HashedPassword = await crypt(NewPassword);

    userExist.password = HashedPassword;
    await userExist.save();

    res.json({ message: "Contraseña restablecidad exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "No se pudo restablecer la contraseña" });
  }
};
