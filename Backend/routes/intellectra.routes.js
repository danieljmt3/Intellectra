import express from "express"
import { corregiOrt, traductor,textoavoz, generacionImagen} from "../controllers/intellectra.controller.js";
import { traduccionLimiter } from "../middleware/limitador.js";

const rutasIntellectra=express.Router();

rutasIntellectra.post('/corregir-ort',corregiOrt)
rutasIntellectra.post('/traducir',traductor)
rutasIntellectra.post('/textospeech',textoavoz)
rutasIntellectra.post('/imagengen',generacionImagen)



export default rutasIntellectra