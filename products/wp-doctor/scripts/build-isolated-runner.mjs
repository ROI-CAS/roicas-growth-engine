import { build } from "esbuild";
import { mkdir, copyFile } from "node:fs/promises";
const destination = ".cache/isolated-container";
await mkdir(destination, { recursive: true });
await build({
  entryPoints: ["apps/isolated-runner/vps.ts"],
  outfile: ".cache/isolated-vps/controller.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
});
await build({
  entryPoints: ["apps/isolated-runner/server.ts"],
  outfile: `${destination}/server.mjs`,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
  external: ["playwright-core"],
});
await build({
  entryPoints: ["packages/isolated-runner/pinned-fetch.ts"],
  outfile: `${destination}/pinned-fetch.mjs`,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
});
for (const name of ["Dockerfile", "package.json", "package-lock.json"])
  await copyFile(
    `infra/containers/isolated-runner/${name}`,
    `${destination}/${name}`,
  );
console.log(
  "Imagen preparada en contexto mínimo: sin secretos, informes ni archivos del proyecto ajenos al ejecutor.",
);
