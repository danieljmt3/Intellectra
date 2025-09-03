import { InferenceClient } from "@huggingface/inference";
import promptModel from "../models/prompt.model.js";
import userModel from "../models/user.model.js";
import { elevenApi, emails, hukey, PassApp, support } from "../config/config.js";
import { ElevenLabsClient } from "elevenlabs";
import { Buffer } from "buffer";
import ReportModel from "../models/reports.model.js";
import nodemailer from "nodemailer"
import { configDotenv } from "dotenv";

configDotenv();

export const corregiOrt = async (req, res) => {
  const hf = new InferenceClient(hukey);
  const { prompt } = req.body;

  const UserExist = await userModel.findById(req.userId);

  try {
    if (!UserExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("Solicitando corrección a HuggingFace...");
    const consulta = await hf.chatCompletion({
      model: "deepseek-ai/DeepSeek-R1-0528",
      provider: "fireworks-ai",
      messages: [
        {
          role: "user",
          content: `Corrige los errores ortográficos en el siguiente texto y damelo con los errores corregidos: ${prompt}`,
        },
      ],
    });
    console.log("Respuesta completa del modelo:", consulta);

    const newprompt = new promptModel({
      content: prompt,
      user: UserExist._id,
    });

    await newprompt.save();

    return res
      .status(200)
      .json({ correctedText: consulta.choices[0].message.content });
  } catch (error) {
    console.log("Existe un error:", error);
    return res.status(400).json({
      error: "Error al generar la corrección",
      details: error.message,
    });
  }
};

export const traductor = async (req, res) => {
  const hf = new InferenceClient(hukey);
  const { prompt, lenbase, lenobjet } = req.body;

  //console.log(prompt,lenbase,lenobjet,sourceLang,targetLang)

  const UserExist = await userModel.findById(req.userId);

  if (!lenbase || !lenobjet) {
    return res.status(400).json({ error: "Código de idioma no soportado" });
  }

  try {
    if (!UserExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const traduccir = await hf.translation({
      model: "facebook/mbart-large-50-many-to-many-mmt",
      inputs: prompt,
      parameters: {
        src_lang: lenbase,
        tgt_lang: lenobjet,
      },
    });

    const newPrompt = new promptModel({
      content: prompt,
      user: UserExist._id,
    });

    newPrompt.save();

    res.status(200).json({ translatedText: traduccir.translation_text });
  } catch (error) {
    console.error("Error al traducir:", error);
    res.status(500).json({ error: "Error en la traducción con Hugging Face." });
  }
};

export const textoavoz = async (req, res) => {
  console.log("Eleven API Key en Render:", `"${elevenApi}"`, elevenApi?.length);
  const elevenLab = new ElevenLabsClient({
    apiKey: "sk_e467b8155ca30979c7b09011ee6f4365cdebe30e7776739e",
  });
  const vocesID = {
    mujer: "FGY2WhTYpPnrIDTdsKH5",
    hombre: "JBFqnCBsd6RMkjVDRZzb",
  };
  const { prompt, genero } = req.body;
  const generoSelect = genero.toLowerCase();
  const VozAUsar = vocesID[generoSelect];

  const UserExist = await userModel.findById(req.userId);

  try {
    console.log(prompt,genero,elevenApi)
    if (!UserExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const voz = await elevenLab.textToSpeech.convert(VozAUsar, {
      text: prompt,
      model_id: "eleven_multilingual_v2",
    });
    const chunks = [];
    for await (const chunk of voz) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename=output_${generoSelect}.mp3`,
      "Content-Length": buffer.length,
    });
    console.log(
      `[ElevenLabs TTS] Texto recibido: "${prompt}" con voz "${generoSelect}"`
    );
    console.log("[ElevenLabs TTS] Conversión exitosa.");

    const newPrompt = new promptModel({
      content: prompt,
      user: UserExist._id,
    });

    newPrompt.save();
    console.log("Prompt guardado");

    return res.send(buffer);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al convertir", error });
  }
};

export const generacionImagen = async (req, res) => {
  const hf = new InferenceClient(hukey);
  const { prompt } = req.body;

  console.log(prompt,hukey);

  const UserExist = await userModel.findById(req.userId);
  try {
    if (!UserExist) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("Generando");
    const generalIMG = await hf.textToImage({
      provider: "hf-inference",
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
    });

    const buffer = await generalIMG.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    const newPrompt = new promptModel({
      content: prompt,
      user: UserExist._id,
    });

    newPrompt.save();

    res.setHeader("Content-Type", "image/png");
    console.log("Imagen enviada");
    return res.status(200).send(imageBuffer);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error al generar la imagen", error });
  }
};

export const report = async (req, res) => {
  const { nombre, email, asunto } = req.body;

  console.log("Recibidos", nombre, email, asunto);

  try {
    const newReport = new ReportModel({
      nombre,
      email,
      asunto,
    });

    newReport.save();

    const trasnport = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:email,
        pass:PassApp
      }
    })

    const mailOPtion={
      to:support,
      from:emails,
      subject:`Problema de ${nombre}`,
      text:`nombre:${nombre} \n correo:${email} \n Tiene el siguiente problema:\n ${asunto}`
    }

    await trasnport.sendMail(mailOPtion)


    console.log("Report guardado");
    res.status(200).json({ message: "Reporte enviado satisfactoriamente" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error al enviar el report", error });
  }
};
