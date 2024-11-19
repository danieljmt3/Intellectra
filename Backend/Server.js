import {puerto } from "./config/config.js";
import rutasIntellectra from "./routes/intellectra.routes.js";
import express from "express";
import multer from "multer";

const app=express();
const subir=multer();

app.use(express.json());

app.use('/',rutasIntellectra)



app.listen(puerto,()=>{
    console.log("Servidor en el puerto "+puerto)
})