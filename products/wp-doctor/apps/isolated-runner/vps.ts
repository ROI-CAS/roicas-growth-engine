import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import {
  authorized,
  jobContract,
} from "../../packages/isolated-runner/job-contract";

// Host controller only. Never mount its Docker socket or credentials into a job.
const secret = process.env.RUNNER_API_SECRET ?? "";
if (secret.length < 48)
  throw new Error("RUNNER_API_SECRET must have at least 48 characters");
const image = process.env.RUNNER_IMAGE ?? "wpdoctor-isolated:local";
const owner = "wpdoctor.isolated=vps-v1";
let busy = false;
let healthy = true;

async function docker(
  args: string[],
  input = "",
  env: Record<string, string> = {},
  timeout = 12000,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", args, {
      shell: false,
      env: { ...process.env, ...env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let output = "";
    let size = 0;
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("docker_timeout"));
    }, timeout);
    child.stdout.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > 4 * 1024 * 1024) {
        child.kill("SIGKILL");
        reject(new Error("output_budget"));
      } else output += chunk.toString();
    });
    // Do not forward Docker stderr: it can include environment or operational details.
    child.stderr.resume();
    child.on("error", () => {
      clearTimeout(timer);
      reject(new Error("docker_unavailable"));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(output.trim());
      else reject(new Error("container_failed"));
    });
    child.stdin.on("error", () => {
      /* A failed container may close stdin first. */
    });
    child.stdin.end(input);
  });
}
const client = `import http from 'node:http';let raw='';for await(const c of process.stdin)raw+=c;const input=JSON.parse(raw);const body=JSON.stringify(input.body);const r=http.request({...input.socket,path:input.path,method:'POST',headers:{Authorization:'Bearer '+process.env.JOB_TOKEN,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let out='';res.on('data',c=>out+=c);res.on('end',()=>{if(res.statusCode!==200)process.exitCode=1;process.stdout.write(out)});});r.on('error',()=>process.exit(1));r.end(body);`;
function call(name: string, path: string, body: unknown, broker: boolean) {
  return docker(
    ["exec", "-i", name, "node", "--input-type=module", "-e", client],
    JSON.stringify({
      path,
      body,
      socket: broker
        ? { socketPath: "/broker/egress.sock" }
        : { host: "127.0.0.1", port: 8080 },
    }),
    {},
    100000,
  );
}
async function ready(name: string, socket: boolean) {
  const code = socket
    ? "import fs from 'node:fs';if(!fs.existsSync('/broker/egress.sock'))process.exit(1)"
    : "const r=await fetch('http://127.0.0.1:8080/health',{signal:AbortSignal.timeout(1000)});if(!r.ok)process.exit(1)";
  for (let i = 0; i < 30; i++) {
    try {
      await docker(["exec", name, "node", "--input-type=module", "-e", code]);
      return;
    } catch {
      await delay(200);
    }
  }
  throw new Error("startup_timeout");
}
async function removeContainer(name: string) {
  await docker(["rm", "-f", name]);
  const ids = await docker(["ps", "-aq", "--filter", `name=^/${name}$`]);
  if (ids) throw new Error("cleanup_unconfirmed");
}
// Reconcile only resources owned by this controller, before accepting jobs.
for (const id of (await docker(["ps", "-aq", "--filter", `label=${owner}`]))
  .split(/\s+/)
  .filter(Boolean))
  await removeContainer(id);
for (const volume of (
  await docker(["volume", "ls", "-q", "--filter", `label=${owner}`])
)
  .split(/\s+/)
  .filter(Boolean))
  await docker(["volume", "rm", volume]);

async function run(job: { job_id: string; target: string }) {
  const id = randomUUID().replaceAll("-", "");
  const broker = `wpd-b-${id}`,
    renderer = `wpd-r-${id}`,
    volume = `wpd-s-${id}`;
  const token = randomBytes(32).toString("hex");
  const env = { JOB_TOKEN: token, JOB_ID: job.job_id, JOB_TARGET: job.target };
  const created: string[] = [];
  let volumeCreated = false;
  let expired = false;
  let response: unknown;
  const timer = setTimeout(() => {
    expired = true;
    void Promise.allSettled(
      [broker, renderer].map((name) => docker(["rm", "-f", name])),
    );
  }, 110000);
  try {
    await docker(["volume", "create", "--label", owner, volume]);
    volumeCreated = true;
    await docker([
      "run",
      "--rm",
      "--network",
      "none",
      "--user",
      "0",
      "--cap-drop",
      "ALL",
      "--cap-add",
      "CHOWN",
      "--mount",
      `type=volume,src=${volume},dst=/broker`,
      image,
      "chown",
      "pwuser:pwuser",
      "/broker",
    ]);
    const common = [
      "--label",
      owner,
      "--read-only",
      "--cap-drop",
      "ALL",
      "--security-opt",
      "no-new-privileges",
      "--tmpfs",
      "/tmp:rw,nosuid,nodev,size=384m",
      "--mount",
      `type=volume,src=${volume},dst=/broker`,
      "-e",
      "JOB_TOKEN",
      "-e",
      "BROKER_SOCKET=/broker/egress.sock",
    ];
    // Track names before creation so cleanup also handles an interrupted Docker CLI.
    created.push(broker);
    await docker(
      [
        "run",
        "-d",
        "--name",
        broker,
        ...common,
        "--network",
        "bridge",
        "--cpus",
        "0.2",
        "--memory",
        "512m",
        "--memory-swap",
        "512m",
        "--pids-limit",
        "64",
        "-e",
        "ROLE=broker",
        image,
      ],
      "",
      env,
    );
    await ready(broker, true);
    await call(broker, "/configure", job, true);
    created.push(renderer);
    await docker(
      [
        "run",
        "-d",
        "--name",
        renderer,
        ...common,
        "--network",
        "none",
        "--cpus",
        "0.5",
        "--memory",
        "1g",
        "--memory-swap",
        "1g",
        "--pids-limit",
        "128",
        "-e",
        "ROLE=renderer",
        "-e",
        "JOB_ID",
        "-e",
        "JOB_TARGET",
        image,
      ],
      "",
      env,
    );
    await ready(renderer, false);
    const result: unknown = JSON.parse(
      await call(renderer, "/run", { target: job.target }, false),
    );
    if (expired) throw new Error("job_deadline");
    response = {
      job_id: job.job_id,
      result,
      public_launch_eligible: process.env.RUNNER_RELEASE_APPROVED === "true",
    };
  } finally {
    clearTimeout(timer);
    for (const name of created.reverse()) {
      try {
        const present = await docker([
          "ps",
          "-aq",
          "--filter",
          `name=^/${name}$`,
        ]);
        if (present) await removeContainer(name);
      } catch {
        healthy = false;
      }
    }
    if (volumeCreated)
      try {
        await docker(["volume", "rm", volume]);
      } catch {
        healthy = false;
      }
  }
  if (!healthy) throw new Error("cleanup_unconfirmed");
  return response;
}
const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if (!authorized(req.headers.authorization, secret)) {
    res.writeHead(404).end("{}");
    return;
  }
  if (req.method === "GET" && req.url === "/health") {
    res
      .writeHead(healthy ? 200 : 503)
      .end(JSON.stringify({ ready: healthy, busy }));
    return;
  }
  if (req.method !== "POST" || req.url !== "/v1/run") {
    res.writeHead(404).end("{}");
    return;
  }
  if (!healthy || busy) {
    res.writeHead(healthy ? 429 : 503).end('{"error":"unavailable"}');
    return;
  }
  busy = true;
  try {
    let size = 0;
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 4096) throw new Error("input_budget");
      chunks.push(Buffer.from(chunk));
    }
    let job;
    try {
      job = jobContract(JSON.parse(Buffer.concat(chunks).toString()));
    } catch {
      res.writeHead(400).end('{"error":"invalid_contract"}');
      return;
    }
    res.end(JSON.stringify(await run(job)));
  } catch {
    res.writeHead(503).end('{"error":"execution_failed"}');
  } finally {
    busy = false;
  }
});
server.requestTimeout = 115000;
server.headersTimeout = 10000;
server.maxHeadersCount = 20;
// Only loopback or the host's Docker bridge address; never bind a public interface.
const listenHost = process.env.RUNNER_LISTEN_HOST ?? "127.0.0.1";
if (!/^(127\.0\.0\.1|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.1)$/.test(listenHost))
  throw new Error("Invalid private listen address");
server.listen(Number(process.env.PORT ?? 8091), listenHost);
