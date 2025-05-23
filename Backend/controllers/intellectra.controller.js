import { HfInference } from "@huggingface/inference";
import { hukey } from "../config/config.js";
import { Readable } from "stream";
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
    console.log(consulta.generated_text)
    return res.status(200).json({ correctedText: respuesta });
  } catch (error) {
    return res.status(400).json({
      error: 'Error al generar la corrección',
      details: error.message,
    });
  }
};

export const traductor = async (req, res) => {
  const hf = new HfInference(hukey);
  const { prompt, lenbase,lenobjet } = req.body;
  const cuerpo=req.body;
  console.log(cuerpo)

  //console.log(prompt,lenbase,lenobjet,sourceLang,targetLang)

  if (!lenbase || !lenobjet) {
    return res.status(400).json({ error: 'Código de idioma no soportado' });
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
  const hf = new HfInference(hukey);
  const { prompt } = req.body;

  try {
    const conversion = await hf.textToSpeech({
      model: "facebook/mms-tts-spa",
      inputs: prompt,
    });
    const arrayBuffer = await conversion.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set({
      "Content-Type": "audio/flac",
      "Content-Disposition": "attachment; filename=output.flac",
      "Content-Length": buffer.length,
    });
    console.log(prompt);
    console.log(conversion);
    return res.send(buffer);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al convertir", error });
  }
};
