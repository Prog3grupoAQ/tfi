import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesPath = path.resolve(__dirname, "..", "..", "templates");

const cargarTemplate = async (nombreTemplate) => {
  const ruta = path.join(templatesPath, nombreTemplate);
  const contenido = await fs.promises.readFile(ruta, "utf-8");
  return handlebars.compile(contenido);
};

const buscarChromeLocal = () => {
  const posiblesRutas = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);

  return posiblesRutas.find((ruta) => fs.existsSync(ruta));
};

export const generarPdfDesdeTemplate = async (nombreTemplate, datos) => {
  const template = await cargarTemplate(nombreTemplate);
  const html = template(datos);
  const launchOptions = {
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  };

  const rutaChrome = buscarChromeLocal();
  if (rutaChrome) {
    launchOptions.executablePath = rutaChrome;
  }

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const buffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" } });
    return buffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
