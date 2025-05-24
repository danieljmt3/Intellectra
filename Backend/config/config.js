import { configDotenv } from "dotenv";

configDotenv();

export const apikey=process.env.Api_key;
export const hukey=process.env.huapi;
export const puerto=process.env.puerto;
export const elevenApi=process.env.api_elevenlabs;