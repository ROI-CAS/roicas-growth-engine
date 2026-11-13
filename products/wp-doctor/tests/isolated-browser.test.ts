import { describe, expect, it, vi } from "vitest";
import {
  isolatedConfigured,
  runIsolatedBrowser,
} from "../packages/core/isolated-browser";
import type { Env } from "../packages/core/env";
const target = "https://doctor.roicas.com/";
const id = "12345678-1234-4234-8234-123456789abc";
const env = {
  ENVIRONMENT: "production",
  BROWSER_DIAGNOSTICS_MODE: "isolated",
  BROWSER_SECURITY_APPROVED: "true",
  ISOLATED_RUNNER_URL: "https://runner.srv1162733.hstgr.cloud",
  ISOLATED_RUNNER_SECRET: "x".repeat(64),
} as Env;
const payload = () => ({
  job_id: id,
  public_launch_eligible: true,
  result: {
    target,
    policy_version: "runner-pinned-egress-v2",
    browser_closed: true,
  },
});
describe("Adaptador HTTPS del ejecutor aislado", () => {
  it("transmite únicamente UUID y URL al endpoint fijo", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => Response.json(payload()));
    expect(await runIsolatedBrowser(env, id, target, fetcher)).toEqual(
      payload().result,
    );
    const [url, init] = fetcher.mock.calls[0]!;
    expect(url).toBe("https://runner.srv1162733.hstgr.cloud/v1/run");
    expect(JSON.parse(init!.body as string)).toEqual({ job_id: id, target });
    expect(init!.redirect).toBe("manual");
  });
  it.each([
    { ...env, ENVIRONMENT: "preview" },
    { ...env, BROWSER_SECURITY_APPROVED: "false" },
    { ...env, ISOLATED_RUNNER_URL: "https://attacker.example" },
    { ...env, ISOLATED_RUNNER_SECRET: undefined },
  ])("no llama al proveedor con configuración no aprobada", async (config) => {
    expect(isolatedConfigured(config)).toBe(false);
    const fetcher = vi.fn<typeof fetch>();
    await expect(
      runIsolatedBrowser(config, id, target, fetcher),
    ).rejects.toThrow("browser_security_gate_closed");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { ...payload(), job_id: "different" },
    { ...payload(), public_launch_eligible: false },
    {
      ...payload(),
      result: { ...payload().result, target: "https://other.example/" },
    },
    { ...payload(), result: { ...payload().result, browser_closed: false } },
    { ...payload(), result: { ...payload().result, policy_version: "old" } },
  ])(
    "rechaza evidencia sin correspondencia o cierre confirmado",
    async (result) => {
      await expect(
        runIsolatedBrowser(env, id, target, async () => Response.json(result)),
      ).rejects.toThrow("browser_result_unavailable");
    },
  );
  it("limita el cuerpo y rechaza errores de servicio", async () => {
    await expect(
      runIsolatedBrowser(
        env,
        id,
        target,
        async () => new Response("x".repeat(2 * 1024 * 1024 + 1)),
      ),
    ).rejects.toThrow("browser_result_budget");
    await expect(
      runIsolatedBrowser(
        env,
        id,
        target,
        async () => new Response("", { status: 429 }),
      ),
    ).rejects.toThrow("browser_provider_unavailable");
  });
});
