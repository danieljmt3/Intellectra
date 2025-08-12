import { configDotenv } from "dotenv";

configDotenv();

export const hukey=process.env.huapi;
export const puerto=process.env.puerto;
export const elevenApi=process.env.api_elevenlabs;
export const cluster=process.env.cluster;
export const JWTSC=process.env.JWT_Secret
export const emails=process.env.emails;