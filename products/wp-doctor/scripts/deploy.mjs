import { spawnSync } from "node:child_process";
const environment = process.argv[2];
if (!["staging", "production"].includes(environment))
  throw new Error("Entorno no válido.");
function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run("node", ["scripts/configure.mjs", environment]);
run("npm", ["run", "check"]);
// Migraciones explícitas antes de desplegar. Configuración/Access/secretos: ver guía.
run("npx", [
  "wrangler",
  "d1",
  "migrations",
  "apply",
  "DB",
  "--remote",
  "--config",
  `infra/wrangler/public.${environment}.generated.json`,
]);
for (const mode of ["admin", "public"])
  run("npx", [
    "wrangler",
    "deploy",
    "--config",
    `infra/wrangler/${mode}.${environment}.generated.json`,
  ]);
