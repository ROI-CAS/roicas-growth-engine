import { safeMessage } from "../../packages/runner/policy";
interface LabEnv {
  RUNNER: { run(input: unknown): Promise<unknown> };
  ADMISSION: {
    claim(id: string): Promise<{ token: string } | null>;
    release(token: string): Promise<boolean>;
    reconcile(): Promise<{ released: boolean }>;
    status(): Promise<{ busy: boolean; retry_after_ms: number }>;
  };
  LAB_TOKEN?: string;
  LAB_EXPIRES_AT: string;
}
export default {
  async fetch(request: Request, env: LabEnv): Promise<Response> {
    if (
      request.method !== "POST" ||
      new URL(request.url).pathname !== "/run" ||
      !env.LAB_TOKEN ||
      request.headers.get("Authorization") !== "Bearer " + env.LAB_TOKEN ||
      Date.now() >= Number(env.LAB_EXPIRES_AT)
    )
      return new Response("Not found", { status: 404 });
    try {
      const tests: Record<string, unknown> = {};
      tests.stale_recovery = await env.ADMISSION.reconcile();
      const lease = await env.ADMISSION.claim(crypto.randomUUID());
      if (!lease)
        return Response.json(
          { error: "runner_busy", ...(await env.ADMISSION.status()) },
          { status: 409 },
        );
      try {
        tests.concurrent_admission_blocked =
          (await env.ADMISSION.claim(crypto.randomUUID())) === null;
      } finally {
        await env.ADMISSION.release(lease.token);
      }
      tests.invalid_contracts = [];
      for (const target of [
        "http://127.0.0.1/",
        "https://169.254.169.254/",
        "https://[::1]/",
        "https://doctor.roicas.com:443/",
        "https://doctor.roicas.com/private",
      ])
        (tests.invalid_contracts as unknown[]).push(
          await env.RUNNER.run({ job_id: crypto.randomUUID(), target }),
        );
      tests.runner = await env.RUNNER.run({
        job_id: crypto.randomUUID(),
        target: "https://doctor.roicas.com/",
      });
      tests.provider_guardrails = (
        tests.runner as { provider_guardrails?: unknown }
      ).provider_guardrails ?? { passed: false, error: "probe_not_completed" };
      return Response.json(
        {
          tests,
          public_launch_eligible: false,
          remaining: [
            "Effective connection IP/DNS rebinding in remote Browser Run not established",
            "Non-HTTP egress isolation not established",
            "No public scanner enabled",
          ],
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (error) {
      return Response.json(
        {
          error: "lab_execution_failed",
          detail: safeMessage(
            error instanceof Error
              ? error.message.replaceAll(env.LAB_TOKEN, "[redacted]")
              : "unknown",
          ),
        },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }
  },
};
