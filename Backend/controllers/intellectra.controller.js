import { InferenceClient} from "@huggingface/inference";
import { elevenApi, hukey } from "../config/config.js";
import { ElevenLabsClient } from "elevenlabs";
import { Buffer } from "buffer";

export const corregiOrt = async (req, res) => {
  const hf = new InferenceClient(hukey);
  const { prompt } = req.body;

  try {
    console.log("Solicitando corrección a HuggingFace...");
    const consulta = await hf.chatCompletion({
      model: "deepseek-ai/DeepSeek-R1-0528",
      provider:"fireworks-ai",
      messages:[
        {
          role:"user",
          content:`Corrige los errores ortográficos en el siguiente texto y damelo con los errores corregidos: ${prompt}`
        }
      ],
    });
    console.log("Respuesta completa del modelo:", consulta);

    

    return res.status(200).json({ correctedText: consulta.choices[0].message.content });
  } catch (error) {
    console.log("Existe un error:",error)
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

  if (!lenbase || !lenobjet) {
    return res.status(400).json({ error: "Código de idioma no soportado" });
  }

  try {
    const traduccir = await hf.translation({
      model: "facebook/mbart-large-50-many-to-many-mmt",
      inputs: prompt,
      parameters: {
        src_lang: lenbase,
        tgt_lang: lenobjet,
      },
    });

    res.status(200).json({ translatedText: traduccir.translation_text });
  } catch (error) {
    console.error("Error al traducir:", error);
    res.status(500).json({ error: "Error en la traducción con Hugging Face." });
  }
};

export const textoavoz = async (req, res) => {
  const elevenLab = new ElevenLabsClient({
    apiKey: elevenApi,
  });
  const vocesID = {
    mujer: "FGY2WhTYpPnrIDTdsKH5",
    hombre: "JBFqnCBsd6RMkjVDRZzb",
  };
  const { prompt, genero } = req.body;
  const generoSelect = genero.toLowerCase();
  const VozAUsar = vocesID[generoSelect];

  try {
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
    return res.send(buffer);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al convertir", error });
  }
};

export const generacionImagen = async (req, res) => {
  const hf = new InferenceClient(hukey);
  const { prompt } = req.body;
   
  console.log(prompt)
  try {
    console.log("Generando")
    const generalIMG = await hf.textToImage({
      provider:"hf-inference",
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
    });
    
    const buffer = await generalIMG.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    res.setHeader("Content-Type", "image/png");
    console.log("Imagen enviada")
    return res.status(200).send(imageBuffer);
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: "Error al generar la imagen", error });
  }
};
