import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, type Server } from "node:http";
import { chromium, type Browser as LocalBrowser } from "@playwright/test";
import type { Browser } from "@cloudflare/playwright";
import { executeBrowser } from "../packages/runner/execute";
import { fixtureHtml } from "../packages/runner/lab-fixture";
import { assessBrowserRun } from "../packages/core/browser-report";
process.env.PLAYWRIGHT_BROWSERS_PATH ??= `${process.cwd()}/.cache/playwright`;
describe("Laboratorio SSRF local instrumentado", () => {
  let browser: LocalBrowser, site: Server, receiver: Server;
  let browserArgs: string[] = [];
  let rootHits = 0;
  let privateHits = 0,
    mutationHits = 0,
    frameHits = 0,
    loopHits = 0;
  const listen = (server: Server) =>
    new Promise<number>((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (!address || typeof address === "string") throw new Error("fixture");
        resolve(address.port);
      });
    });
  beforeAll(async () => {
    receiver = createServer((_request, response) => {
      privateHits++;
      response.end("controlled receiver");
    });
    const receiverPort = await listen(receiver);
    site = createServer((request, response) => {
      const path = new URL(request.url!, "http://public.lab.test").pathname;
      if (path === "/") {
        rootHits++;
        response.setHeader("Content-Type", "text/html");
        response.end(
          fixtureHtml(
            "http://receiver.lab.test",
            `http://127.0.0.1:${receiverPort}`,
          ),
        );
      } else if (path === "/redirect-private") {
        response.writeHead(302, {
          Location: `http://127.0.0.1:${receiverPort}/probe`,
        });
        response.end();
      } else if (path === "/redirect-loop") {
        loopHits++;
        response.writeHead(302, { Location: "/redirect-loop" });
        response.end();
      } else if (path === "/wp-content/plugins/demo/fixture.js") {
        response.setHeader("Content-Type", "text/javascript");
        response.end('console.error("fixture-resource");');
      } else {
        if (path === "/mutation") mutationHits++;
        if (path === "/frame-probe") frameHits++;
        response.writeHead(404);
        response.end();
      }
    });
    const port = await listen(site);
    browserArgs = [
      `--host-resolver-rules=MAP public.lab.test 127.0.0.1:${port},MAP receiver.lab.test 127.0.0.1:${receiverPort}`,
      "--no-proxy-server",
    ];
    browser = await chromium.launch({ headless: true, args: browserArgs });
    // Positive control: verify this instrumented receiver is actually reachable.
    const page = await browser.newPage();
    await page.goto("http://receiver.lab.test/probe");
    expect(privateHits).toBe(1);
    await page.close();
    privateHits = 0;
  });
  afterAll(async () => {
    await browser?.close();
    site?.closeAllConnections();
    receiver?.closeAllConnections();
    await Promise.all([
      new Promise<void>((resolve) => site?.close(() => resolve())),
      new Promise<void>((resolve) => receiver?.close(() => resolve())),
    ]);
  });
  it("captura señales y evita conexiones al receptor, POST, frames y sockets", async () => {
    const run = await executeBrowser(
      "http://public.lab.test/",
      async () => ["8.8.8.8"],
      async () => browser as unknown as Browser,
    );
    expect(run.browser_closed).toBe(true);
    expect(run.profiles).toHaveLength(2);
    expect(run.profiles.every((p) => p.http_status === 200)).toBe(true);
    expect(run.profiles.every((p) => p.wordpress === "probable")).toBe(true);
    const evidence = run.profiles.flatMap((p) => p.evidence);
    expect(
      evidence.some(
        (e) =>
          e.kind === "javascript" && e.message.includes("fixture-pageerror"),
      ),
    ).toBe(true);
    expect(evidence.some((e) => e.kind === "http" && e.status === 404)).toBe(
      true,
    );
    const assessment = assessBrowserRun(run, "http://public.lab.test/");
    expect(
      run.profiles.some((p) => p.resources?.some((r) => r.status === 404)),
    ).toBe(true);
    expect(assessment.technologies?.some((t) => t.id === "plugin:demo")).toBe(
      true,
    );
    expect(
      assessment.findings.some(
        (f) =>
          f.category === "javascript" &&
          f.evidence.includes("fixture-pageerror"),
      ),
    ).toBe(true);
    expect(
      assessment.findings.some(
        (f) => f.category === "http" && f.evidence === "HTTP 404",
      ),
    ).toBe(true);
    expect(assessment.coverageLimited).toBe(true);
    expect(
      assessment.findings
        .filter((f) => f.category === "transport")
        .some((f) => f.url.includes("receiver.lab.test")),
    ).toBe(false);
    expect(
      evidence.some((e) => e.kind === "blocked" && e.message === "method"),
    ).toBe(true);
    expect(JSON.stringify(run)).not.toContain("DO_NOT_STORE");
    expect(JSON.stringify(run)).not.toContain("persona@");
    expect(privateHits).toBe(0);
    expect(mutationHits).toBe(0);
    expect(frameHits).toBe(0);
    expect(loopHits).toBeLessThanOrEqual(8);
  }, 100000);
  it("bloquea un cambio del resolvedor a loopback antes de navegar", async () => {
    browser = await chromium.launch({ headless: true, args: browserArgs });
    const before = rootHits;
    let resolutions = 0;
    const run = await executeBrowser(
      "http://public.lab.test/",
      async () => (++resolutions === 1 ? ["8.8.8.8"] : ["127.0.0.1"]),
      async () => browser as unknown as Browser,
    );
    expect(
      run.profiles.every((p) =>
        p.evidence.some(
          (e) => e.kind === "blocked" && e.message === "dns_non_public",
        ),
      ),
    ).toBe(true);
    expect(rootHits).toBe(before);
    expect(privateHits).toBe(0);
    expect(run.browser_closed).toBe(true);
  }, 100000);
});
