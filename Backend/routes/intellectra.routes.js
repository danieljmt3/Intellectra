import express from "express"
import { corregiOrt, traductor,textoavoz} from "../controllers/intellectra.controller.js";
import { traduccionLimiter } from "../middleware/limitador.js";

const rutasIntellectra=express.Router();

rutasIntellectra.post('/corregir-ort',corregiOrt)
rutasIntellectra.post('/traduccir',traductor)
rutasIntellectra.post('/textospeech',textoavoz)



export default rutasIntellectra