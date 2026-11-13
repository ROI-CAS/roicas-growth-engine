import { createServer, request as ipcRequest } from "node:http";
import { chromium } from "playwright-core";
import type { Browser } from "@cloudflare/playwright";
import { executeBrowser } from "../../packages/runner/execute";
import { targetHomepage, PolicyError } from "../../packages/runner/policy";
import {
  pinnedFetch,
  systemResolver,
  type TransferBudget,
  type PinnedResponse,
} from "../../packages/isolated-runner/pinned-fetch";
import { nativeNetworkProbe } from "../../packages/isolated-runner/network-probe";

const role = process.env.ROLE ?? "renderer";
const token = process.env.JOB_TOKEN;
if (!token || token.length < 32)
  throw new Error("Missing isolated job capability");
let active: { id: string; target: string; budget: TransferBudget } | null =
  null;
let used = false;
let lastIP: string | undefined;
function authorize(value: string | undefined) {
  return value === `Bearer ${token}`;
}
async function read(
  request: AsyncIterable<Uint8Array>,
): Promise<Record<string, unknown>> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 8192) throw new PolicyError("input_budget");
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<
    string,
    unknown
  >;
}
async function egress(url: string, method: string): Promise<PinnedResponse> {
  const body = JSON.stringify({ job_id: process.env.JOB_ID, url, method });
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Content-Length": String(Buffer.byteLength(body)),
  };
  if (process.env.BROKER_SOCKET) {
    return new Promise((resolve, reject) => {
      const request = ipcRequest(
        {
          socketPath: process.env.BROKER_SOCKET,
          path: "/fetch",
          method: "POST",
          headers,
          timeout: 12000,
        },
        (response) => {
          const chunks: Buffer[] = [];
          let bytes = 0;
          response.on("data", (chunk: Buffer) => {
            bytes += chunk.length;
            if (bytes > 3 * 1024 * 1024) {
              response.destroy();
              reject(new PolicyError("bridge_budget"));
              return;
            }
            chunks.push(chunk);
          });
          response.on("end", () => {
            try {
              const result = JSON.parse(
                Buffer.concat(chunks).toString(),
              ) as PinnedResponse & { error?: string };
              if (response.statusCode !== 200)
                reject(new PolicyError(result.error ?? "egress_blocked"));
              else resolve(result);
            } catch {
              reject(new PolicyError("egress_invalid"));
            }
          });
          response.on("error", reject);
        },
      );
      request.on("timeout", () => request.destroy(new Error("timeout")));
      request.on("error", reject);
      request.end(body);
    });
  }
  const response = await fetch("http://egress.wpdoctor.internal/fetch", {
    method: "POST",
    headers,
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    const result = (await response.json()) as { error?: string };
    throw new PolicyError(result.error ?? "egress_blocked");
  }
  return (await response.json()) as PinnedResponse;
}
const server = createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  if (request.url === "/health" && request.method === "GET") {
    response.end('{"ready":true}');
    return;
  }
  if (request.method !== "POST" || !authorize(request.headers.authorization)) {
    response.writeHead(404);
    response.end("{}");
    return;
  }
  try {
    const input = await read(request);
    if (role === "broker" && request.url === "/network-probe") {
      if (!active || new URL(active.target).hostname !== "doctor.roicas.com")
        throw new PolicyError("probe_not_allowed");
      const ips = await systemResolver("doctor.roicas.com");
      const ip = ips.find((ip) => !ip.includes(":"));
      if (!ip) throw new PolicyError("probe_unavailable");
      response.end(JSON.stringify({ ip, ...(await nativeNetworkProbe(ip)) }));
      return;
    }
    if (role === "broker" && request.url === "/configure") {
      if (active) throw new PolicyError("broker_busy");
      if (typeof input.job_id !== "string" || typeof input.target !== "string")
        throw new PolicyError("invalid_contract");
      const target = targetHomepage(input.target, [
        new URL(input.target).hostname,
      ]);
      active = {
        id: input.job_id,
        target,
        budget: {
          remaining: 5 * 1024 * 1024,
          requests: 0,
          deadline: Date.now() + 100000,
        },
      };
      setTimeout(() => process.exit(124), 110000).unref();
      response.end('{"configured":true}');
      return;
    }
    if (role === "broker" && request.url === "/fetch") {
      if (
        !active ||
        input.job_id !== active.id ||
        typeof input.url !== "string" ||
        typeof input.method !== "string"
      )
        throw new PolicyError("inactive_job");
      const result = await pinnedFetch(
        input.url,
        input.method,
        new URL(active.target).hostname,
        active.budget,
      );
      response.end(JSON.stringify(result));
      return;
    }
    if (role === "renderer" && request.url === "/run") {
      if (
        used ||
        typeof input.target !== "string" ||
        input.target !== process.env.JOB_TARGET
      )
        throw new PolicyError("invalid_contract");
      used = true;
      if (
        input.force_crash === true &&
        process.env.SECURITY_TEST === "1" &&
        new URL(input.target).hostname === "doctor.roicas.com"
      )
        process.exit(78);
      const target = targetHomepage(input.target, [
        new URL(input.target).hostname,
      ]);
      setTimeout(() => process.exit(124), 105000).unref();
      const result = await executeBrowser(
        target,
        async () => {
          throw new PolicyError("browser_dns_disabled");
        },
        async () => {
          const browser = await chromium.launch({
            headless: true,
            chromiumSandbox: false,
            args: [
              "--disable-dev-shm-usage",
              "--disable-background-networking",
              "--disable-quic",
            ],
            env: {
              PATH: process.env.PATH ?? "/usr/bin:/bin",
              HOME: "/tmp",
              TMPDIR: "/tmp",
              PLAYWRIGHT_BROWSERS_PATH: "/ms-playwright",
            },
          });
          return browser as unknown as Browser;
        },
        undefined,
        async (url, method) => {
          const result = await egress(url, method);
          lastIP = result.selected_ip;
          return { ...result, body: Buffer.from(result.body, "base64") };
        },
      );
      const probe =
        input.security_probe === true &&
        new URL(target).hostname === "doctor.roicas.com" &&
        lastIP
          ? await nativeNetworkProbe(lastIP)
          : undefined;
      response.end(
        JSON.stringify({
          ...result,
          ...(probe ? { network_probe: probe } : {}),
        }),
      );
      return;
    }
    response.writeHead(404);
    response.end("{}");
  } catch (error) {
    response.writeHead(422);
    response.end(
      JSON.stringify({
        error:
          error instanceof PolicyError ? error.code : "isolated_run_failed",
      }),
    );
  }
});
server.requestTimeout = 110000;
server.headersTimeout = 10000;
server.maxHeadersCount = 30;
if (role === "broker" && process.env.BROKER_SOCKET) {
  server.listen(process.env.BROKER_SOCKET, () => {
    void import("node:fs/promises").then((fs) =>
      fs.chmod(process.env.BROKER_SOCKET!, 0o660),
    );
  });
} else server.listen(8080, "0.0.0.0");
