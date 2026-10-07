import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "./_kv"; // o donde tengas createClient

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuración de CORS si necesitas consultar la API desde otros orígenes/apps
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const configData = req.body;

    // Si req.body viene como string, parsearlo; si ya es objeto, usarlo directo
    const payload =
      typeof configData === "string" ? JSON.parse(configData) : configData;

    // Guardamos la configuración con una clave global
    await kv.set("matrix_global_config", payload);

    return res
      .status(200)
      .json({ success: true, message: "Configuración guardada correctamente" });
  } catch (error) {
    return res.status(500).json({
      error: "Error al guardar la configuración",
      details: String(error),
    });
  }
}
