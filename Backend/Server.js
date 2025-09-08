import { puerto } from "./config/config.js";
import rutasIntellectra from "./routes/intellectra.routes.js";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import loginroute from "./routes/intellectra.login.routes.js";
import mongooconnect from "./config/BD.js";
import pass from "./routes/intellectra.password.routes.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongooconnect();

app.use("/intellectra", loginroute);
app.use("/intellectra", rutasIntellectra);
app.use("/intellectra", pass);

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const angulaPath = path.join(_dirname, "..", "dist", "angular-gpt", "browser");

app.use(express.static(angulaPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(angulaPath, "index.html"));
});

app.listen(puerto, () => {
  console.log("Servidor en el puerto " + puerto);
});
