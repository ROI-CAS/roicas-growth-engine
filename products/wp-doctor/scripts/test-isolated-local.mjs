import { spawnSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomBytes, randomUUID } from "node:crypto";
import { setTimeout } from "node:timers";
const tag = randomBytes(5).toString("hex");
const names = {
  broker: `wpd-broker-${tag}`,
  renderer: `wpd-renderer-${tag}`,
  canary: `wpd-canary-${tag}`,
  network: `wpd-lab-${tag}`,
  socket: `wpd-socket-${tag}`,
  cert: `wpd-cert-${tag}`,
  fault: `wpd-fault-${tag}`,
  memory: `wpd-memory-${tag}`,
  recovery: `wpd-recovery-${tag}`,
};
const token = randomBytes(32).toString("hex");
const job = randomUUID();
const image = "wpdoctor-isolated:local";
const containers = [],
  volumes = [];
let network = false;
function docker(...args) {
  const r = spawnSync("docker", args, {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
    timeout: 120000,
  });
  if (r.status !== 0)
    throw new Error(
      (r.stderr || r.stdout).replaceAll(token, "[redacted]").slice(-2000),
    );
  return r.stdout.trim();
}
function exec(name, code, user) {
  return docker(
    "exec",
    ...(user ? ["--user", user] : []),
    name,
    "node",
    "--input-type=module",
    "-e",
    code,
  );
}
function check(value, message) {
  if (!value) throw Error(message);
}
async function ready(name) {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      exec(
        name,
        "const r=await fetch('http://127.0.0.1:8080/health',{signal:AbortSignal.timeout(1000)});if(!r.ok)process.exit(1)",
      );
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  throw new Error("Container did not become ready");
}
const call = (name, path, body) =>
  JSON.parse(
    exec(
      name,
      `import http from 'node:http';const body=${JSON.stringify(JSON.stringify(body))};const r=http.request({socketPath:'/broker/egress.sock',path:${JSON.stringify(path)},method:'POST',headers:{Authorization:'Bearer '+process.env.JOB_TOKEN,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let out='';res.on('data',c=>out+=c);res.on('end',()=>process.stdout.write(out));});r.on('error',e=>{throw e});r.end(body);`,
    ),
  );
try {
  docker(
    "network",
    "create",
    "--internal",
    "--subnet",
    "11.44.0.0/24",
    "--label",
    `wpdoctor.lab=${tag}`,
    names.network,
  );
  network = true;
  for (const name of [names.socket, names.cert]) {
    docker("volume", "create", "--label", `wpdoctor.lab=${tag}`, name);
    volumes.push(name);
  }
  docker(
    "run",
    "--rm",
    "--network",
    "none",
    "--user",
    "0",
    "-v",
    `${names.socket}:/broker`,
    image,
    "chown",
    "pwuser:pwuser",
    "/broker",
  );
  docker(
    "run",
    "--rm",
    "--network",
    "none",
    "--user",
    "0",
    "-v",
    `${names.cert}:/lab`,
    image,
    "sh",
    "-c",
    "openssl req -x509 -newkey rsa:2048 -nodes -keyout /lab/key.pem -out /lab/ca.pem -days 1 -subj /CN=isolated-lab.roicas.com -addext subjectAltName=DNS:isolated-lab.roicas.com >/dev/null 2>&1 && chmod 644 /lab/key.pem /lab/ca.pem",
  );
  docker(
    "run",
    "-d",
    "--name",
    names.canary,
    "--label",
    `wpdoctor.lab=${tag}`,
    "--network",
    "bridge",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "--memory",
    "256m",
    "-v",
    `${names.cert}:/lab:ro`,
    "--entrypoint",
    "node",
    image,
    "--input-type=module",
    "-e",
    await readFile("tests/fixtures/isolated-canary.mjs", "utf8"),
  );
  containers.push(names.canary);
  docker(
    "network",
    "connect",
    "--ip",
    "11.44.0.2",
    names.network,
    names.canary,
  );
  const canaryIP = JSON.parse(docker("inspect", names.canary))[0]
    .NetworkSettings.Networks.bridge.IPAddress;
  docker(
    "run",
    "-d",
    "--name",
    names.broker,
    "--label",
    `wpdoctor.lab=${tag}`,
    "--network",
    "bridge",
    "--add-host",
    "isolated-lab.roicas.com:11.44.0.2",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "--memory",
    "512m",
    "--pids-limit",
    "64",
    "--tmpfs",
    "/tmp:rw,nosuid,nodev,size=64m",
    "-e",
    "ROLE=broker",
    "-e",
    `JOB_TOKEN=${token}`,
    "-e",
    "BROKER_SOCKET=/broker/egress.sock",
    "-e",
    "NODE_EXTRA_CA_CERTS=/lab/ca.pem",
    "-v",
    `${names.socket}:/broker`,
    "-v",
    `${names.cert}:/lab:ro`,
    image,
  );
  containers.push(names.broker);
  docker(
    "network",
    "connect",
    "--ip",
    "11.44.0.3",
    names.network,
    names.broker,
  );
  // Native TCP and UDP positive controls prove the canary is reachable from the broker.
  const probeCode = `import net from 'node:net';import dgram from 'node:dgram';const host=${JSON.stringify(canaryIP)};const tcp=await new Promise(r=>{const s=net.connect(8081,host,()=>s.end('GET /hit HTTP/1.0\\r\\nHost: canary\\r\\n\\r\\n'));s.setTimeout(1500);s.on('data',()=>{});s.on('end',()=>r(true));s.on('error',()=>r(false));s.on('timeout',()=>{s.destroy();r(false)});});const udp=await new Promise(r=>{const s=dgram.createSocket('udp4');const t=setTimeout(()=>{s.close();r(false)},1500);s.on('message',()=>{clearTimeout(t);s.close();r(true)});s.on('error',()=>{clearTimeout(t);s.close();r(false)});s.send('controlled',8082,host);});console.log(JSON.stringify({tcp,udp}));`;
  const positive = JSON.parse(exec(names.broker, probeCode));
  check(positive.tcp && positive.udp, "Native positive controls failed");
  exec(names.broker, `await fetch('http://${canaryIP}:8081/reset');`);
  // Change the real system resolver between validation and connect. A second
  // lookup would hit the reachable private interface, while the checked IP stays pinned.
  const rebinding = JSON.parse(
    exec(
      names.broker,
      `import {pinnedFetch,systemResolver} from '/app/pinned-fetch.mjs';import fs from 'node:fs';let calls=0;const r=await pinnedFetch('https://isolated-lab.roicas.com/','GET','isolated-lab.roicas.com',{remaining:5242880,requests:0,deadline:Date.now()+10000},async host=>{calls++;const addresses=await systemResolver(host);fs.writeFileSync('/etc/hosts',fs.readFileSync('/etc/hosts','utf8').replace('11.44.0.2\\tisolated-lab.roicas.com',${JSON.stringify(canaryIP)}+'\\tisolated-lab.roicas.com'));return addresses;});const now=await systemResolver('isolated-lab.roicas.com');let rejected=false;try{await pinnedFetch('https://isolated-lab.roicas.com/','GET','isolated-lab.roicas.com',{remaining:5242880,requests:0,deadline:Date.now()+10000});}catch(e){rejected=e.code==='dns_non_public';}console.log(JSON.stringify({calls,selected:r.selected_ip,connected:r.connected_ip,changedTo:now,rejected}));`,
      "0",
    ),
  );
  check(
    rebinding.calls === 1 &&
      rebinding.selected === "11.44.0.2" &&
      rebinding.connected === "11.44.0.2" &&
      rebinding.changedTo.includes(canaryIP) &&
      rebinding.rejected,
    "DNS pinning/rebinding control failed",
  );
  exec(
    names.broker,
    `import fs from 'node:fs';fs.writeFileSync('/etc/hosts',fs.readFileSync('/etc/hosts','utf8').replace(${JSON.stringify(canaryIP)}+'\\tisolated-lab.roicas.com','11.44.0.2\\tisolated-lab.roicas.com'));await fetch('http://${canaryIP}:8081/reset');`,
    "0",
  );
  check(
    call(names.broker, "/configure", {
      job_id: job,
      target: "https://isolated-lab.roicas.com/",
    }).configured,
    "Broker setup failed",
  );
  docker(
    "run",
    "-d",
    "--name",
    names.renderer,
    "--label",
    `wpdoctor.lab=${tag}`,
    "--network",
    "none",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "--read-only",
    "--memory",
    "1g",
    "--cpus",
    "1",
    "--pids-limit",
    "128",
    "--tmpfs",
    "/tmp:rw,nosuid,nodev,size=384m",
    "-e",
    "ROLE=renderer",
    "-e",
    `JOB_TOKEN=${token}`,
    "-e",
    `JOB_ID=${job}`,
    "-e",
    "JOB_TARGET=https://isolated-lab.roicas.com/",
    "-e",
    "BROKER_SOCKET=/broker/egress.sock",
    "-v",
    `${names.socket}:/broker`,
    image,
  );
  containers.push(names.renderer);
  const negative = JSON.parse(exec(names.renderer, probeCode));
  check(!negative.tcp && !negative.udp, "Renderer bypassed network isolation");
  const run = JSON.parse(
    exec(
      names.renderer,
      `const r=await fetch('http://127.0.0.1:8080/run',{method:'POST',headers:{Authorization:'Bearer '+process.env.JOB_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({target:'https://isolated-lab.roicas.com/'})});process.stdout.write(await r.text());`,
    ),
  );
  check(
    run.browser_closed &&
      run.profiles?.length === 2 &&
      run.profiles.every((p) => p.http_status === 200),
    "Isolated browser did not complete profiles",
  );
  const evidence = run.profiles.flatMap((p) => p.evidence);
  check(
    evidence.some(
      (e) =>
        e.kind === "javascript" &&
        e.message.includes("fixture-plugin-exception"),
    ),
    "Missing actual JS exception",
  );
  check(
    evidence.some((e) => e.kind === "http" && e.status === 404),
    "Missing actual HTTP 404",
  );
  check(
    evidence.some((e) => e.kind === "blocked" && e.message === "method"),
    "POST not blocked",
  );
  const counts = JSON.parse(
    exec(
      names.broker,
      `process.stdout.write(await(await fetch('http://${canaryIP}:8081/counts')).text());`,
    ),
  );
  check(
    counts.httpHits === 0 &&
      counts.udpHits === 0 &&
      counts.mutations === 0 &&
      counts.privateHits === 0,
    "Forbidden canary received a connection",
  );
  const redirect = call(names.broker, "/fetch", {
    job_id: job,
    url: "https://isolated-lab.roicas.com/redirect",
    method: "GET",
  });
  check(
    redirect.error === "redirect_blocked",
    "Redirect escaped broker policy",
  );
  const large = call(names.broker, "/fetch", {
    job_id: job,
    url: "https://isolated-lab.roicas.com/large",
    method: "GET",
  });
  check(
    large.error === "transfer_budget",
    "Oversized response was not rejected",
  );
  const inspect = JSON.parse(docker("inspect", names.renderer))[0];
  check(
    inspect.HostConfig.NetworkMode === "none" &&
      inspect.HostConfig.ReadonlyRootfs &&
      inspect.Config.User === "pwuser",
    "Missing container hardening",
  );
  check(
    !evidence.some((e) => e.message.includes("fixture-cookie-leak")),
    "Cookie crossed browser contexts",
  );
  docker(
    "run",
    "-d",
    "--name",
    names.fault,
    "--label",
    `wpdoctor.lab=${tag}`,
    "--network",
    "none",
    "--read-only",
    "--cap-drop",
    "ALL",
    "--memory",
    "256m",
    "--pids-limit",
    "32",
    "-e",
    "ROLE=renderer",
    "-e",
    `JOB_TOKEN=${token}`,
    "-e",
    "JOB_TARGET=https://doctor.roicas.com/",
    "-e",
    "SECURITY_TEST=1",
    image,
  );
  containers.push(names.fault);
  await ready(names.fault);
  const crash = spawnSync(
    "docker",
    [
      "exec",
      names.fault,
      "node",
      "--input-type=module",
      "-e",
      `await fetch('http://127.0.0.1:8080/run',{method:'POST',headers:{Authorization:'Bearer '+process.env.JOB_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({target:'https://doctor.roicas.com/',force_crash:true})});`,
    ],
    { encoding: "utf8", timeout: 10000 },
  );
  void crash;
  docker("wait", names.fault);
  const crashed = JSON.parse(docker("inspect", names.fault))[0];
  check(
    crashed.State.ExitCode === 78 && !crashed.State.Running,
    "Forced process failure did not stop container",
  );
  docker(
    "run",
    "-d",
    "--name",
    names.memory,
    "--label",
    `wpdoctor.lab=${tag}`,
    "--network",
    "none",
    "--read-only",
    "--cap-drop",
    "ALL",
    "--memory",
    "64m",
    "--memory-swap",
    "64m",
    "--pids-limit",
    "16",
    "--entrypoint",
    "node",
    image,
    "-e",
    "const blocks=[];setInterval(()=>blocks.push(Buffer.alloc(8*1024*1024,1)),10)",
  );
  containers.push(names.memory);
  docker("wait", names.memory);
  const oom = JSON.parse(docker("inspect", names.memory))[0];
  check(
    oom.State.OOMKilled && !oom.State.Running,
    "Memory cap did not terminate the process",
  );
  docker(
    "run",
    "-d",
    "--name",
    names.recovery,
    "--label",
    `wpdoctor.lab=${tag}`,
    "--network",
    "none",
    "--read-only",
    "--cap-drop",
    "ALL",
    "--memory",
    "1g",
    "--pids-limit",
    "128",
    "--tmpfs",
    "/tmp:rw,nosuid,nodev,size=384m",
    "-e",
    "ROLE=renderer",
    "-e",
    `JOB_TOKEN=${token}`,
    "-e",
    `JOB_ID=${job}`,
    "-e",
    "JOB_TARGET=https://isolated-lab.roicas.com/",
    "-e",
    "BROKER_SOCKET=/broker/egress.sock",
    "-v",
    `${names.socket}:/broker`,
    image,
  );
  containers.push(names.recovery);
  await ready(names.recovery);
  const recovered = JSON.parse(
    exec(
      names.recovery,
      `const r=await fetch('http://127.0.0.1:8080/run',{method:'POST',headers:{Authorization:'Bearer '+process.env.JOB_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({target:'https://isolated-lab.roicas.com/'})});process.stdout.write(await r.text());`,
    ),
  );
  check(
    recovered.browser_closed &&
      recovered.profiles.every((p) => p.http_status === 200),
    "Fresh execution after process failure did not recover",
  );
  const lifecycle = {
    forcedExit: crashed.State.ExitCode,
    memoryKilled: oom.State.OOMKilled,
    recovered: true,
  };
  const result = {
    passed: true,
    testedAt: new Date().toISOString(),
    positive,
    negative,
    rebinding,
    counts,
    lifecycle,
    renderer: {
      network: inspect.HostConfig.NetworkMode,
      memory: inspect.HostConfig.Memory,
      pids: inspect.HostConfig.PidsLimit,
      user: inspect.Config.User,
    },
    run,
  };
  await mkdir("reports/isolated-runner", { recursive: true });
  await writeFile(
    "reports/isolated-runner/local.latest.json",
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify({
      ...result,
      run: {
        status: run.status,
        profiles: run.profiles.map((p) => ({
          profile: p.profile,
          status: p.status,
          http: p.http_status,
          blocked: p.blocked,
        })),
        browser_closed: run.browser_closed,
      },
    }),
  );
} catch (error) {
  const debug = [];
  for (const name of containers) {
    try {
      debug.push({
        name,
        logs: (() => {
          const out = spawnSync("docker", ["logs", name], { encoding: "utf8" });
          return (out.stdout + out.stderr).replaceAll(token, "[redacted]");
        })(),
        state: JSON.parse(docker("inspect", name))[0].State,
      });
    } catch {
      /* A stopped container may no longer have inspectable output. */
    }
  }
  await mkdir("reports/isolated-runner", { recursive: true });
  await writeFile(
    "reports/isolated-runner/local-failure.json",
    JSON.stringify({ error: String(error), debug }, null, 2),
  );
  throw error;
} finally {
  for (const name of containers.reverse()) {
    try {
      const labels = JSON.parse(docker("inspect", name))[0].Config.Labels;
      if (labels?.["wpdoctor.lab"] === tag) docker("rm", "-f", name);
    } catch {
      /* Keep evidence; only this run's labelled resources are eligible. */
    }
  }
  if (network)
    try {
      docker("network", "rm", names.network);
    } catch {
      /* Already absent. */
    }
  for (const name of volumes)
    try {
      const labels = JSON.parse(docker("volume", "inspect", name))[0].Labels;
      if (labels?.["wpdoctor.lab"] === tag) docker("volume", "rm", name);
    } catch {
      /* Only this run's volume. */
    }
}
