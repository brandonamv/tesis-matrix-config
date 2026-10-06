import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "node:fs";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    viteSingleFile(),
    {
      name: "save-matrix-plugin",
      configureServer(server) {
        server.middlewares.use("/api/save-matrix", (req, res) => {
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", () => {
              try {
                const filePath = path.resolve(
                  import.meta.dirname,
                  "src/assets/matrix.json",
                );
                fs.writeFileSync(filePath, body, "utf-8");
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(err) }));
              }
            });
          }
        });
        server.middlewares.use("/api/read-matrix", (req, res) => {
          if (req.method === "GET") {
            try {
              const filePath = path.resolve(
                import.meta.dirname,
                "src/assets/matrix.json",
              );
              const data = fs.readFileSync(filePath, "utf-8");
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(data);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          }
        });
      },
    },
  ],
});
