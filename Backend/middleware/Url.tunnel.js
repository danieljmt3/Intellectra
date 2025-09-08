import fs from "fs";
import path from "path";

/**
 * Espera a que aparezca la URL del túnel en un archivo y la retorna.
 * @param {number} timeout Tiempo máximo en ms para esperar (default 30s)
 * @param {number} interval Intervalo de reintento en ms (default 500ms)
 * @returns {Promise<string>} La URL del túnel
 */
export function getTunnelUrl(timeout = 30000, interval = 500) {
  const filePath = path.resolve("backend/cloudflare_url.txt");

  return new Promise((resolve, reject) => {
    const start = Date.now();

    const checkFile = () => {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        const match = content.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
        if (match) return resolve(match[0]);
      }

      if (Date.now() - start >= timeout) {
        return reject(new Error("No se encontró la URL del túnel en el tiempo esperado"));
      }

      setTimeout(checkFile, interval);
    };

    checkFile();
  });
}
