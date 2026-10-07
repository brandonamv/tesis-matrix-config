import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "./_kv"; // o donde tengas createClient

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const dataDB: any = await kv.get("matrix_global_config");
    if (!dataDB) {
      return res
        .status(404)
        .json({ error: "No se encontró ninguna configuración" });
    }

    const data = `v=${dataDB.resourceGain ?? ""}
c=${dataDB.resourceCost ?? ""}
m=${dataDB.timePenalty ?? ""}
i=${dataDB.initialFitness ?? ""}
r=${dataDB.initialResources ?? ""}
u=${dataDB.maxFitness ?? ""}
s=${dataDB.simulationSpeed ?? ""}
p=${dataDB.maxInteractions ?? ""}
t=${dataDB.resourceIncrementType ?? ""}
f=${dataDB.resourceIncrementFormula ?? ""}
0=${dataDB.class1?.formulas?.[0] ?? ""};${dataDB.class1?.formulas?.[1] ?? ""};${dataDB.class1?.initialPlayers ?? ""};${dataDB.class1?.name ?? ""}
1=${dataDB.class2?.formulas?.[0] ?? ""};${dataDB.class2?.formulas?.[1] ?? ""};${dataDB.class2?.initialPlayers ?? ""};${dataDB.class2?.name ?? ""}`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({
      error: "Error al consultar la configuración",
      details: String(error),
    });
  }
}
