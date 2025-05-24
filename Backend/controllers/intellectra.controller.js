import { HfInference } from "@huggingface/inference";
import { elevenApi, hukey } from "../config/config.js";
import { ElevenLabsClient } from "elevenlabs";
import { Buffer } from "buffer";

export const corregiOrt = async (req, res) => {
  const hf = new HfInference(hukey);
  const { prompt } = req.body;

  try {
    console.log("Solicitando corrección a HuggingFace...");
    const consulta = await hf.textGeneration({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      inputs: `Corrige los errores ortográficos en el siguiente texto y damelo con los errores corregidos: ${prompt}`,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        repetition_penalty: 1.2,
      },
    });
    console.log("Respuesta completa del modelo:", consulta);

    let respuesta = consulta.generated_text;

    if (
      respuesta.startsWith(
        `Corrige los errores ortográficos en el siguiente texto y damelo con los errores corregidos: ${prompt}`
      )
    ) {
      respuesta = respuesta
        .replace(
          `Corrige los errores ortográficos en el siguiente texto y damelo con los errores corregidos: ${prompt}`,
          ""
        )
        .trim();
    }
    console.log(consulta.generated_text);
    return res.status(200).json({ correctedText: respuesta });
  } catch (error) {
    return res.status(400).json({
      error: "Error al generar la corrección",
      details: error.message,
    });
  }
};

export const traductor = async (req, res) => {
  const hf = new HfInference(hukey);
  const { prompt, lenbase, lenobjet } = req.body;
  const cuerpo = req.body;
  console.log(cuerpo);

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

    // Ajusta las cabeceras de la respuesta
    res.set({
      "Content-Type": "audio/mpeg", // ElevenLabs suele generar MP3
      "Content-Disposition": `attachment; filename=output_${generoSelect}.mp3`,
      "Content-Length": buffer.length,
    });
    console.log(
      `[ElevenLabs TTS] Texto recibido: "${prompt}" con voz "${generoSelect}"`
    );
    console.log("[ElevenLabs TTS] Conversión exitosa.");
    return res.send(buffer);
    /*const voices = await elevenLab.voices.getAll();
    console.log(voices)
    return res.json(voices);*/
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al convertir", error });
  }
};
