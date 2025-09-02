import express from "express"
import { corregiOrt, traductor,textoavoz, generacionImagen, report} from "../controllers/intellectra.controller.js";
import { verifyToken } from "../middleware/Jwt.js";

const rutasIntellectra=express.Router();

rutasIntellectra.post('/corregir-ort',verifyToken,corregiOrt)
rutasIntellectra.post('/traducir',verifyToken,traductor)
rutasIntellectra.post('/textospeech',verifyToken,textoavoz)
rutasIntellectra.post('/imagengen',verifyToken,generacionImagen)
rutasIntellectra.post('/report',report)



export default rutasIntellectra