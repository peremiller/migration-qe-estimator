import { copyFile, cp, mkdir, readdir } from "node:fs/promises";

await mkdir("dist/client", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

const entries = await readdir("dist", { withFileTypes: true });
for (const entry of entries) {
  if (["client", "server", ".openai"].includes(entry.name)) continue;
  await cp(`dist/${entry.name}`, `dist/client/${entry.name}`, { recursive: true, force: true });
}

await copyFile("sites/worker.js", "dist/server/index.js");
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
