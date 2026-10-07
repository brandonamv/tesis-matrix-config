import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "./_kv"; // o donde tengas createClient

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = await kv.get("matrix_global_config");

    if (!data) {
      return res.status(200).json(null);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error en read-matrix:", error);
    return res
      .status(500)
      .json({
        error: "Error al consultar la base de datos",
        details: String(error),
      });
  }
}
