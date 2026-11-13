import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { build } from "esbuild";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
describe("Admisión distribuida del navegador", () => {
  let mf: Miniflare;
  let gate: {
    claim(id: string): Promise<{ token: string; job_id: string } | null>;
    release(token: string): Promise<boolean>;
    stale(): Promise<unknown>;
  };
  beforeAll(async () => {
    const bundled = await build({
      stdin: {
        contents:
          'export {RunnerLease} from "./apps/runner-admission/lease.ts";export default {fetch(){return new Response("fixture")}};',
        resolveDir: process.cwd(),
        loader: "ts",
      },
      bundle: true,
      write: false,
      format: "esm",
      platform: "browser",
      external: ["cloudflare:workers"],
    });
    mf = new Miniflare(
      convertV4MiniflareOptions({
        modules: true,
        script: bundled.outputFiles[0]!.text,
        compatibilityDate: "2026-10-15",
        durableObjects: { GATE: { className: "RunnerLease", useSQLite: true } },
      }),
    );
    const namespace = await mf.getDurableObjectNamespace("GATE");
    gate = namespace.get(
      namespace.idFromName("global-browser-runner"),
    ) as unknown as typeof gate;
  });
  afterAll(async () => {
    await mf?.dispose();
  });
  it("admite uno entre llamadas concurrentes y no libera con otro token", async () => {
    const jobs = [
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
    ];
    const claims = await Promise.all(jobs.map((id) => gate.claim(id)));
    const acquired = claims.filter((v) => v !== null);
    expect(acquired).toHaveLength(1);
    const token = acquired[0]!.token;
    expect(await gate.release(crypto.randomUUID())).toBe(false);
    expect(await gate.claim(crypto.randomUUID())).toBe(null);
    expect(await gate.stale()).toBe(null);
    expect(await gate.release(token)).toBe(true);
    const next = await gate.claim(crypto.randomUUID());
    expect(next).toBeTruthy();
    expect(next!.token).not.toBe(token);
    await gate.release(next!.token);
  });
});
