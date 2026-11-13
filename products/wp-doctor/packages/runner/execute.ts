import type {
  Browser,
  Page,
  Request as BrowserRequest,
} from "@cloudflare/playwright";
import { resourceSignal, type ResourceSignal } from "../core/site-evidence";
import {
  budgets,
  NetworkPolicy,
  PolicyError,
  RUNNER_POLICY_VERSION,
  safeMessage,
  safeUrl,
  type Resolver,
} from "./policy";

export type Evidence = {
  kind: "http" | "javascript" | "console" | "transport" | "blocked";
  url: string;
  message: string;
  status?: number;
};
export type ProfileResult = {
  profile: "desktop" | "mobile";
  status: "completed" | "partial" | "failed";
  reason: string | null;
  http_status: number | null;
  wordpress: "probable" | "unknown";
  evidence: Evidence[];
  blocked: number;
  bytes_observed: number;
  screenshot_base64: string | null;
  resources?: ResourceSignal[];
  generator?: string;
  hints?: "rankmath"[];
};
export type RunnerResult = {
  policy_version: string;
  target: string;
  measured_at: string;
  status: "completed" | "partial" | "failed";
  profiles: ProfileResult[];
  browser_closed: boolean;
  provider_guardrails?: {
    passed: boolean;
    status?: number;
    mitigated?: string;
    reason?: string;
    error?: string;
  };
  limitations: string[];
};
export type Launcher = (host: string) => Promise<Browser>;
export type IsolatedTransport = (url: string, method: string) => Promise<{status:number;headers:Record<string,string>;body:Buffer;bytes:number}>;
function redirectCount(request: BrowserRequest): number {
  let n = 0;
  for (let r = request.redirectedFrom(); r; r = r.redirectedFrom())
    if (++n > budgets.redirects) break;
  return n;
}
async function profile(
  browser: Browser,
  target: string,
  mode: "desktop" | "mobile",
  resolve: Resolver,
  jobDeadline: number,
  transport?: IsolatedTransport,
): Promise<ProfileResult> {
  const deadline = Math.min(jobDeadline, Date.now() + budgets.profileMs);
  const policy = new NetworkPolicy(new URL(target).hostname, resolve, deadline);
  const result: ProfileResult = {
    profile: mode,
    status: "completed",
    reason: null,
    http_status: null,
    wordpress: "unknown",
    evidence: [],
    blocked: 0,
    bytes_observed: 0,
    screenshot_base64: null,
    resources: [],
  };
  const seen = new Set<string>();
  const add = (entry: Evidence) => {
    const item = {
      ...entry,
      url: safeUrl(entry.url),
      message: safeMessage(entry.message),
    };
    const key = JSON.stringify(item);
    if (!seen.has(key) && result.evidence.length < budgets.events) {
      seen.add(key);
      result.evidence.push(item);
    }
  };
  const context = await browser.newContext({
    viewport:
      mode === "desktop"
        ? { width: 1440, height: 900 }
        : { width: 390, height: 844 },
    isMobile: mode === "mobile",
    hasTouch: mode === "mobile",
    userAgent:
      mode === "mobile"
        ? "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    serviceWorkers: "block",
    acceptDownloads: false,
    permissions: [],
    ignoreHTTPSErrors: false,
  });
  let page: Page | undefined;
  const terminate = (reason: string) => {
    result.status = "partial";
    result.reason ??= reason;
    void context.close().catch(() => {});
  };
  const timer = setTimeout(
    () => terminate("deadline"),
    Math.max(1, deadline - Date.now()),
  );
  try {
    context.setDefaultTimeout(5000);
    context.setDefaultNavigationTimeout(Math.max(1, deadline - Date.now()));
    await context.routeWebSocket("**/*", (route) => {
      result.blocked++;
      result.status = "partial";
      result.reason ??= "policy_limited";
      add({ kind: "blocked", url: route.url(), message: "websocket" });
      route.close();
    });
    await context.addInitScript(() => {
      for (const name of [
        "RTCPeerConnection",
        "webkitRTCPeerConnection",
        "WebTransport",
      ]) {
        try {
          Object.defineProperty(globalThis, name, {
            value: undefined,
            writable: false,
            configurable: false,
          });
        } catch {
          /* An unavailable browser API remains unavailable. */
        }
      }
    });
    let intercepted = 0;
    await context.route("**/*", async (route) => {
      const request = route.request();
      try {
        if (++intercepted > budgets.requests)
          throw new PolicyError("request_budget");
        if (!page || request.frame() !== page.mainFrame())
          throw new PolicyError("subframe_or_worker");
        if (["media", "other"].includes(request.resourceType()))
          throw new PolicyError("resource_type");
        const url = transport
          ? policy.checkShape(request.url(), request.method(), redirectCount(request))
          : await policy.check(request.url(), request.method(), redirectCount(request));
        if (
          request.isNavigationRequest() &&
          (url.pathname !== "/" || url.search)
        )
          throw new PolicyError("homepage_only");
        if (url.pathname.startsWith("/wp-content/"))
          result.wordpress = "probable";
        const headers = { ...request.headers() };
        for (const name of ["authorization", "cookie", "proxy-authorization"])
          delete headers[name];
        if (transport) {
          const response = await transport(url.href, request.method());
          result.bytes_observed += response.bytes;
          if (result.bytes_observed > budgets.bytes) throw new PolicyError("transfer_budget");
          await route.fulfill({status:response.status,headers:response.headers,body:response.body});
        } else await route.continue({ headers });
      } catch (error) {
        result.blocked++;
        result.status = "partial";
        result.reason ??= "policy_limited";
        const code =
          error instanceof PolicyError ? error.code : "policy_unavailable";
        add({ kind: "blocked", url: request.url(), message: code });
        if (["deadline", "request_budget"].includes(code)) terminate(code);
        await route.abort("blockedbyclient").catch(() => {});
      }
    });
    page = await context.newPage();
    context.on("page", (popup) => {
      if (popup !== page) void popup.close().catch(() => {});
    });
    page.on("pageerror", (error) => {
      const source = error.stack
        ?.match(/https?:\/\/[^\s)]+/)?.[0]
        ?.replace(/:\d+(?::\d+)?$/, "");
      add({
        kind: "javascript",
        url: source ?? page!.url(),
        message: error.message,
      });
    });
    page.on("console", (msg) => {
      if (msg.type() === "error")
        add({
          kind: "console",
          url: msg.location().url || page!.url(),
          message: msg.text(),
        });
    });
    page.on("requestfailed", (request) =>
      add({
        kind: "transport",
        url: request.url(),
        message: request.failure()?.errorText ?? "request_failed",
      }),
    );
    page.on("response", (response) => {
      if (result.resources!.length < 100) {
        try {
          result.resources!.push(
            resourceSignal(
              response.url(),
              response.request().resourceType(),
              response.status(),
            ),
          );
        } catch {
          /* Non-HTTP resources are outside inventory. */
        }
      }
      if (response.status() >= 400)
        add({
          kind: "http",
          url: response.url(),
          message: "http_response",
          status: response.status(),
        });
      const size = Number(response.headers()["content-length"] ?? 0);
      if (size > budgets.bytes) terminate("declared_response_budget");
      const headers = response.headers();
      if (headers["cf-mitigated"] === "guardrails") {
        result.status = "partial";
        result.reason = "guardrails";
      } else if (headers["cf-mitigated"] === "challenge") {
        result.status = "partial";
        result.reason = "blocked_by_challenge";
      }
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    // Playwright routing does not re-run the handler for every redirected URL.
    // Stop redirects at Chromium's response interception stage, before following.
    // This first release intentionally allows zero redirects (stricter than PRD's 3).
    await cdp.send("Fetch.enable", {
      patterns: [{ urlPattern: "*", requestStage: "Response" }],
    });
    cdp.on("Fetch.requestPaused", async (event) => {
      try {
        if (
          event.responseStatusCode !== undefined &&
          event.responseStatusCode >= 300 &&
          event.responseStatusCode < 400
        ) {
          result.blocked++;
          result.status = "partial";
          add({
            kind: "blocked",
            url: event.request.url,
            message: "redirect_denied",
          });
          await cdp.send("Fetch.failRequest", {
            requestId: event.requestId,
            errorReason: "BlockedByClient",
          });
        } else
          await cdp.send("Fetch.continueResponse", {
            requestId: event.requestId,
          });
      } catch {
        terminate("interception_failed");
      }
    });
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    cdp.on("Network.dataReceived", (event) => {
      if (transport) return;
      result.bytes_observed += event.encodedDataLength;
      if (result.bytes_observed > budgets.bytes) terminate("transfer_budget");
    });
    const response = await page.goto(target, {
      waitUntil: "domcontentloaded",
      timeout: Math.max(1, deadline - Date.now()),
    });
    result.http_status = response?.status() ?? null;
    await page.waitForTimeout(
      Math.min(750, Math.max(0, deadline - Date.now())),
    );
    if (result.http_status !== null && result.http_status >= 400)
      result.status = "partial";
    const generator = await page
      .locator('meta[name="generator"]')
      .first()
      .getAttribute("content", { timeout: 1000 })
      .catch(() => null);
    if (generator && /wordpress/i.test(generator))
      result.wordpress = "probable";
    if (generator) result.generator = safeMessage(generator).slice(0, 100);
    const timings = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .slice(0, 100)
        .map((entry) => {
          const r = entry as PerformanceResourceTiming;
          return { url: r.name, bytes: r.transferSize, duration: r.duration };
        }),
    );
    for (const resource of result.resources ?? []) {
      const timing = timings.find((t) => safeUrl(t.url) === resource.url);
      if (timing) {
        resource.bytes = timing.bytes > 0 ? timing.bytes : null;
        resource.durationMs = timing.duration > 0 ? timing.duration : null;
      }
    }
    result.hints = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document,
        NodeFilter.SHOW_COMMENT,
      );
      let node: Node | null,
        count = 0;
      while ((node = walker.nextNode()) && count++ < 400)
        if (/Rank Math/i.test(node.textContent ?? ""))
          return ["rankmath" as const];
      return [];
    });
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 35,
      fullPage: false,
      timeout: Math.min(5000, Math.max(1, deadline - Date.now())),
    });
    if (screenshot.length <= budgets.screenshotBytes)
      result.screenshot_base64 = screenshot.toString("base64");
    else {
      result.status = "partial";
      result.reason ??= "screenshot_budget";
    }
  } catch {
    if (!result.reason)
      result.reason = Date.now() >= deadline ? "deadline" : "navigation_failed";
    result.status = result.http_status === null ? "failed" : "partial";
  } finally {
    clearTimeout(timer);
    await context.close().catch(() => {});
  }
  return result;
}
export async function executeBrowser(
  target: string,
  resolve: Resolver,
  launch: Launcher,
  afterProfiles?: (
    browser: Browser,
  ) => Promise<NonNullable<RunnerResult["provider_guardrails"]>>,
  transport?: IsolatedTransport,
): Promise<RunnerResult> {
  const deadline = Date.now() + budgets.jobMs;
  const entryPolicy = new NetworkPolicy(new URL(target).hostname, resolve, deadline);
  if (transport) entryPolicy.checkShape(target);
  else await entryPolicy.check(target);
  const result: RunnerResult = {
    policy_version: transport ? "runner-pinned-egress-v2" : RUNNER_POLICY_VERSION,
    target,
    measured_at: new Date().toISOString(),
    status: "completed",
    profiles: [],
    browser_closed: false,
    limitations: [
      "Solo portada, navegador emulado y observaciones externas; no confirma causas internas ni malware.",
      "Solo host exacto aprobado; recursos de terceros, subframes, sockets y acciones de escritura se bloquean.",
      ...(transport ? [
        "El navegador usa respuestas del servicio de salida; DNS e IP de conexión se verifican en el transporte fijado.",
        "Se limita la transferencia recibida a 5 MiB por trabajo y 2 MiB por recurso; el análisis puede ser parcial.",
      ] : [
        "DNS se valida antes de cada solicitud; la IP efectiva al conectar y vectores fuera de HTTP requieren evidencia adicional antes de publicar el escáner.",
        "El presupuesto de transferencia se corta al observar eventos de red y puede excederse por datos en vuelo.",
      ]),
    ],
  };
  const browser = await launch(new URL(target).hostname);
  try {
    for (const mode of ["desktop", "mobile"] as const) {
      if (Date.now() >= deadline) break;
      result.profiles.push(
        await profile(browser, target, mode, resolve, deadline, transport),
      );
    }
    result.status =
      result.profiles.length === 2 &&
      result.profiles.every((p) => p.status === "completed")
        ? "completed"
        : result.profiles.every((p) => p.status === "failed")
          ? "failed"
          : "partial";
    if (afterProfiles) {
      try {
        result.provider_guardrails = await afterProfiles(browser);
      } catch {
        result.provider_guardrails = {
          passed: false,
          error: "guardrail_probe_failed",
        };
      }
    }
  } finally {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        browser.close(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("close_timeout")), 5000);
        }),
      ]);
      result.browser_closed = true;
    } catch {
      result.status = "partial";
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  return result;
}
