import {puerto } from "./config/config.js";
import rutasIntellectra from "./routes/intellectra.routes.js";
import cors from "cors"
import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import loginroute from "./routes/intellectra.login.routes.js";
import mongooconnect from "./config/BD.js";




const app=express();

app.use(cors({
    origin:"http://localhost:4200",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

mongooconnect();

app.use('/intellectra',loginroute);
app.use('/intellectra',rutasIntellectra);



app.listen(puerto,()=>{
    console.log("Servidor en el puerto "+puerto)
})