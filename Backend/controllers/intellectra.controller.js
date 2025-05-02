import { HfInference } from "@huggingface/inference";
import { hukey } from "../config/config.js";
import { lenguajes_codigos } from "../helpers/lenguajes.js";
import { Readable } from "stream";
export const corregiOrt = async (req, res) => {
  const hf = new HfInference(hukey);
  const { prompt } = req.body;

  try {
    const consulta = await hf.textGeneration({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      inputs: `Corrige los errores ortográficos en el siguiente texto y damelo con los errores corregidos: ${prompt}`,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        repetition_penalty: 1.2,
      },
    });

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

    return res.status(200).json({ correctedText: respuesta });
  } catch (error) {
    return res.status(400).json({ result: respuesta });
  }
};

export const traductor = async (req, res) => {
  const hf = new HfInference(hukey);
  const { prompt, lenbase, lentradu } = req.body;

  const lenbasecode = lenguajes_codigos[lenbase.toLowerCase()];
  const lentraducode = lenguajes_codigos[lentradu.toLowerCase()];

  console.log(lenbasecode, lentraducode);

  try {
    const consultatra = await hf.translation({
      model: "facebook/nllb-200-distilled-600M",
      inputs: prompt,
      parameters: {
        src_lang: lenbasecode,
        tgt_lang: lentraducode,
      },
    });

    console.log(consultatra);
    return res.status(200).json({ message: consultatra });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al traducir" });
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
    console.log(prompt)
    console.log(conversion)
    return res.send(buffer)
  } catch (error) {
    console.log(error)
    return res.status(400).json({message:"Error al convertir",error})
  }
};
