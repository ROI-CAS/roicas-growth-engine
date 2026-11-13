import type { Env } from "./env";

export function isolatedConfigured(env: Env): boolean {
  return (
    env.ENVIRONMENT !== "preview" &&
    env.BROWSER_DIAGNOSTICS_MODE === "isolated" &&
    env.BROWSER_SECURITY_APPROVED === "true" &&
    env.ISOLATED_RUNNER_URL === "https://runner.srv1162733.hstgr.cloud" &&
    (env.ISOLATED_RUNNER_SECRET?.length ?? 0) >= 48
  );
}
export async function runIsolatedBrowser(
  env: Env,
  job_id: string,
  target: string,
  upstream: typeof fetch = fetch,
): Promise<unknown> {
  if (!isolatedConfigured(env)) throw new Error("browser_security_gate_closed");
  const response = await upstream(`${env.ISOLATED_RUNNER_URL}/v1/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ISOLATED_RUNNER_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ job_id, target }),
    redirect: "manual",
    signal: AbortSignal.timeout(112000),
  });
  if (!response.ok || !response.body)
    throw new Error("browser_provider_unavailable");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 2 * 1024 * 1024) throw new Error("browser_result_budget");
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const joined = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const payload = JSON.parse(new TextDecoder().decode(joined)) as {
    job_id?: string;
    public_launch_eligible?: boolean;
    result?: {
      target?: string;
      policy_version?: string;
      browser_closed?: boolean;
    };
  };
  if (
    payload.job_id !== job_id ||
    payload.public_launch_eligible !== true ||
    payload.result?.target !== target ||
    payload.result?.policy_version !== "runner-pinned-egress-v2" ||
    payload.result?.browser_closed !== true
  )
    throw new Error("browser_result_unavailable");
  return payload.result;
}
