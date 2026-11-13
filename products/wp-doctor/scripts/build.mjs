import { build } from "esbuild";
import { mkdir, copyFile, cp } from "node:fs/promises";
await mkdir("dist/site/assets", { recursive: true });
await build({
  entryPoints: ["apps/public/client.ts", "apps/public/payment.ts", "apps/admin/client.ts"],
  outdir: "dist/site/assets",
  entryNames: "[dir]/[name]",
  outbase: "apps",
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
});
await copyFile("apps/public/style.css", "dist/site/assets/style.css");
await copyFile("apps/public/landing.css", "dist/site/assets/landing.css");
await cp("apps/public/assets/illustrations", "dist/site/assets/illustrations", {
  recursive: true,
});
await cp("apps/public/assets/fonts", "dist/site/assets/fonts", {
  recursive: true,
});
await cp("apps/public/assets/brand", "dist/site/assets/brand", {
  recursive: true,
});
await build({
  entryPoints: ["apps/public/worker.ts", "apps/admin/worker.ts"],
  outdir: "dist/workers",
  outbase: "apps",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  external: ["cloudflare:workers"],
});
console.log("Assets y Workers generados. No se ha realizado un despliegue.");
