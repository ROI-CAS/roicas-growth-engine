import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
const base = "infra/wrangler/runner-lab.staging.jsonc";
const generated = "infra/wrangler/runner-lab.staging.generated.json";
const secrets = ".cache/runner-lab-secrets.json";
const token = randomBytes(32).toString("hex");
await mkdir(".cache", { recursive: true });
await mkdir("reports", { recursive: true });
const config = JSON.parse(await readFile(base, "utf8"));
config.workers_dev = true;
config.vars.LAB_EXPIRES_AT = String(Date.now() + 15 * 60 * 1000);
await writeFile(generated, JSON.stringify(config, null, 2));
await writeFile(secrets, JSON.stringify({ LAB_TOKEN: token }));
function wrangler(...args) {
  const result = spawnSync(
    process.execPath,
    ["node_modules/wrangler/bin/wrangler.js", ...args],
    { stdio: "inherit" },
  );
  if (result.status !== 0)
    throw new Error("Wrangler failed; no credentials printed");
}
let opened = false;
try {
  wrangler(
    "deploy",
    "--config",
    "infra/wrangler/runner-admission.staging.jsonc",
  );
  wrangler("deploy", "--config", "infra/wrangler/browser-runner.staging.jsonc");
  opened = true;
  wrangler("deploy", "--config", generated, "--secrets-file", secrets);
  await delay(7000);
  const requestSuite = () =>
    fetch("https://wpdoctor-runner-lab-staging.casinmiedo.workers.dev/run", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(160000),
    });
  let response = await requestSuite();
  const parse = async (response) => {
    try {
      return await response.json();
    } catch {
      return { error: "non_json_remote_response" };
    }
  };
  let result = await parse(response);
  for (
    let retry = 0;
    response.status === 409 && result.error === "runner_busy" && retry < 6;
    retry++
  ) {
    console.log(
      "Admisión retenida; esperando conciliación segura sin iniciar otro navegador.",
    );
    await delay(
      Math.max(10000, Math.min(30000, result.retry_after_ms ?? 30000)),
    );
    response = await requestSuite();
    result = await parse(response);
  }
  await writeFile(
    "reports/runner-remote.latest.json",
    JSON.stringify({ http_status: response.status, ...result }, null, 2),
  );
  await writeFile(
    `reports/runner-remote.${new Date().toISOString().replaceAll(":", "-")}.json`,
    JSON.stringify({ http_status: response.status, ...result }, null, 2),
  );
  console.log(
    JSON.stringify({
      http_status: response.status,
      error: result.error,
      detail: result.detail,
      admission: result.tests?.concurrent_admission_blocked,
      invalid_contracts: result.tests?.invalid_contracts,
      runner_status: result.tests?.runner?.status,
      runner_reason: result.tests?.runner?.reason,
      browser_closed: result.tests?.runner?.browser_closed,
      profiles: result.tests?.runner?.profiles?.map((p) => ({
        profile: p.profile,
        status: p.status,
        reason: p.reason,
        http_status: p.http_status,
        blocked: p.blocked,
        bytes_observed: p.bytes_observed,
        evidence: p.evidence,
      })),
      provider_guardrails: result.tests?.provider_guardrails,
      capacity: result.tests?.capacity,
      public_launch_eligible: result.public_launch_eligible,
    }),
  );
  const passed =
    response.ok &&
    result.tests?.concurrent_admission_blocked === true &&
    result.tests?.invalid_contracts?.every(
      (item) => item.status === "rejected",
    ) &&
    result.tests?.runner?.browser_closed === true &&
    result.tests?.runner?.profiles?.length === 2 &&
    result.tests.runner.profiles.every((p) => p.http_status === 200) &&
    result.tests?.provider_guardrails?.passed === true;
  if (!passed)
    throw new Error(
      "Remote checks incomplete: see reports/runner-remote.latest.json; public scanner remains disabled.",
    );
} finally {
  if (opened) {
    wrangler("deploy", "--config", base);
    console.log(
      "Laboratorio remoto cerrado; runner y admisión permanecen privados.",
    );
  }
}
