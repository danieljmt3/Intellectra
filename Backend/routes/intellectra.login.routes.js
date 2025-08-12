import express from "express";
import { login, registrar } from "../controllers/login.controller.js";

const loginroute = express.Router();

loginroute.post("/user/register",registrar);
loginroute.post("/user/login",login);

export default loginroute;
