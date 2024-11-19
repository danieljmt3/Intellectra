import express from "express"
import { corregiOrt, traductor} from "../controllers/intellectra.controller.js";

const rutasIntellectra=express.Router();

rutasIntellectra.post('/corregir-ort',corregiOrt)
rutasIntellectra.post('/traduccir',traductor)



export default rutasIntellectra