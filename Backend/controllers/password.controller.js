import { emails, JWTSC, puerto } from "../config/config.js";
import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";
import nodemailer from "nodemailer"
import { from } from "rxjs";

export const requestpasswordRest = async (req, res, next) => {
  const { email } = req.body;

    try {
        const userExist= userModel.findOne({email});
        if(!userExist) return res.status(404).json({message:"Usuario no encontrado"});

        const secret= JWTSC+userExist.password;
        const Token= jwt.sign({id:userExist._id,email:userExist.email},secret,{expiresIn:'1h'});

        const resetUrl=`https://localhost:${puerto}/intellectra/reset-passw?id=${userExist._id}&token=${Token}`;

        const trasporter= nodemailer.createTransport({
          service:"gmail",
          auth:{
            user:"noresponder@gmail.com",
            pass:"password"
          }
        })

        const mailOPtion= {
          to:userExist.email,
          from:emails,
          subject:'Restablecer contraseña',
          text:`Hola ${userExist.name} has enviado una solicitud para restablecer tu contraseña,\n \n
          Por eso te hemos enviado este enlace para que puedas realizar el proceso:\n \n
          ${resetUrl} \n \n
          Si no hiciste esto, por favor ignora este mensaje`
        }

        await trasporter.sendMail(mailOPtion);

    } catch (error) {
        
    }


};
