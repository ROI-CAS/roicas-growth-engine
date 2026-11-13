import { spawn } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { mkdir, writeFile } from "node:fs/promises";
const secret = randomBytes(32).toString("hex");
const port = 18091;
const base = `http://127.0.0.1:${port}`;
const headers = {
  Authorization: `Bearer ${secret}`,
  "Content-Type": "application/json",
};
const child = spawn(process.execPath, [".cache/isolated-vps/controller.mjs"], {
  env: { ...process.env, RUNNER_API_SECRET: secret, PORT: String(port) },
  stdio: ["ignore", "ignore", "pipe"],
});
let error = "";
child.stderr.on("data", (chunk) => {
  error += chunk.toString().replaceAll(secret, "[redacted]");
});
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      ready = (await fetch(`${base}/health`, { headers })).ok;
      if (ready) break;
    } catch {
      /* Startup reconciliation can take a few seconds. */
    }
    await delay(200);
  }
  if (!ready) throw new Error(`Controller unavailable: ${error.slice(-1000)}`);
  if ((await fetch(`${base}/health`)).status !== 404)
    throw new Error("Missing authentication");
  const invalid = await fetch(`${base}/v1/run`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      job_id: randomUUID(),
      target: "https://127.0.0.1/",
    }),
  });
  if (invalid.status !== 400) throw new Error("Invalid target accepted");
  const running = fetch(`${base}/v1/run`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      job_id: randomUUID(),
      target: "https://doctor.roicas.com/",
    }),
    signal: AbortSignal.timeout(115000),
  });
  let busy = false;
  for (let i = 0; i < 20; i++) {
    busy = (await (await fetch(`${base}/health`, { headers })).json()).busy;
    if (busy) break;
    await delay(100);
  }
  if (!busy) throw new Error("Job did not acquire admission");
  const duplicate = await fetch(`${base}/v1/run`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      job_id: randomUUID(),
      target: "https://doctor.roicas.com/",
    }),
  });
  if (duplicate.status !== 429)
    throw new Error("Concurrent job was not rejected");
  const run = await running;
  const result = await run.json();
  if (
    !run.ok ||
    !result.result?.browser_closed ||
    result.result?.profiles?.length !== 2
  )
    throw new Error(`Controlled job failed: ${JSON.stringify(result)}`);
  const health = await (await fetch(`${base}/health`, { headers })).json();
  if (!health.ready || health.busy)
    throw new Error("Cleanup did not release controller");
  await mkdir("reports/isolated-runner", { recursive: true });
  await writeFile(
    "reports/isolated-runner/controller.latest.json",
    JSON.stringify(
      { testedAt: new Date().toISOString(), passed: true, ...result },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      passed: true,
      browser_closed: result.result.browser_closed,
      profiles: result.result.profiles.map((p) => ({
        profile: p.profile,
        status: p.status,
        http: p.http_status,
      })),
      controller: health,
    }),
  );
} finally {
  child.kill();
}
