import ipaddr from "ipaddr.js";
import { z } from "zod";
import { normalizeWebsite } from "../contracts";

export const RUNNER_POLICY_VERSION = "runner-passive-v1";
export class PolicyError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
export type Resolver = (hostname: string) => Promise<string[]>;
export const runnerInput = z
  .object({ job_id: z.uuid(), target: z.string().max(2048) })
  .strict();
export const budgets = {
  requests: 40,
  redirects: 3,
  bytes: 5 * 1024 * 1024,
  events: 60,
  profileMs: 35000,
  jobMs: 90000,
  screenshotBytes: 180000,
};

export function publicAddress(address: string): boolean {
  try {
    const parsed = ipaddr.parse(address);
    if (
      parsed.kind() === "ipv6" &&
      (parsed as ipaddr.IPv6).isIPv4MappedAddress()
    )
      return false;
    return parsed.range() === "unicast";
  } catch {
    return false;
  }
}
export function approvedHosts(raw: string): string[] {
  const parsed = z.array(z.string()).min(1).max(10).parse(JSON.parse(raw));
  return [
    ...new Set(
      parsed.map((host) => {
        if (
          host !== host.toLowerCase() ||
          host.includes("/") ||
          host.includes(":") ||
          host.includes("*")
        )
          throw new PolicyError("invalid_approved_host");
        if (new URL(normalizeWebsite(host)).hostname !== host)
          throw new PolicyError("invalid_approved_host");
        return host;
      }),
    ),
  ];
}
export function targetHomepage(raw: string, approved: string[]): string {
  const normalized = normalizeWebsite(raw);
  const original = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (
    original.pathname !== "/" ||
    original.search ||
    original.hash ||
    original.protocol !== "https:"
  )
    throw new PolicyError("homepage_https_only");
  if (!approved.includes(new URL(normalized).hostname))
    throw new PolicyError("target_not_approved");
  return normalized;
}
export class NetworkPolicy {
  private requests = 0;
  constructor(
    readonly hostname: string,
    private resolve: Resolver,
    private deadline: number,
  ) {}
  checkShape(raw: string, method = "GET", redirects = 0): URL {
    if (Date.now() > this.deadline) throw new PolicyError("deadline");
    if (++this.requests > budgets.requests)
      throw new PolicyError("request_budget");
    if (!["GET", "HEAD"].includes(method)) throw new PolicyError("method");
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      throw new PolicyError("invalid_url");
    }
    if (!["http:", "https:"].includes(url.protocol))
      throw new PolicyError("protocol");
    // Inspect authority before URL normalizes an explicit default port away.
    const authority = raw.slice(raw.indexOf("://") + 3).split(/[/?#]/)[0] ?? "";
    if (url.username || url.password || authority.includes("@"))
      throw new PolicyError("credentials");
    if (authority.includes(":") || url.port)
      throw new PolicyError("port_or_ip_literal");
    if (url.hostname !== this.hostname)
      throw new PolicyError("host_not_allowed");
    if (redirects > budgets.redirects) throw new PolicyError("redirect_budget");
    if (
      /^\/(?:wp-admin(?:\/|$)|wp-login\.php|xmlrpc\.php|checkout(?:\/|$)|cart(?:\/|$))/i.test(
        url.pathname,
      ) ||
      [...url.searchParams.keys()].some((key) =>
        ["action", "add-to-cart", "wc-ajax", "_wpnonce", "logout"].includes(
          key.toLowerCase(),
        ),
      )
    )
      throw new PolicyError("active_endpoint");
    return url;
  }
  async check(raw: string, method = "GET", redirects = 0): Promise<URL> {
    const url = this.checkShape(raw, method, redirects);
    const addresses = await this.resolve(url.hostname);
    if (!addresses.length) throw new PolicyError("dns_unresolved");
    if (addresses.some((ip) => !publicAddress(ip)))
      throw new PolicyError("dns_non_public");
    if (Date.now() > this.deadline) throw new PolicyError("deadline");
    return url;
  }
}

export async function resolvePublicDns(
  hostname: string,
  upstream: typeof fetch = fetch,
): Promise<string[]> {
  const responses = await Promise.all(
    [1, 28].map(async (type) => {
      const url = new URL("https://cloudflare-dns.com/dns-query");
      url.searchParams.set("name", hostname);
      url.searchParams.set("type", String(type));
      const response = await upstream(url, {
        headers: { Accept: "application/dns-json" },
        redirect: "manual",
        signal: AbortSignal.timeout(4000),
      });
      if (!response.ok || !response.body)
        throw new PolicyError("dns_unavailable");
      const reader = response.body.getReader();
      let length = 0;
      const parts: Uint8Array[] = [];
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.length;
        if (length > 16384) {
          await reader.cancel();
          throw new PolicyError("dns_oversize");
        }
        parts.push(value);
      }
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const part of parts) {
        bytes.set(part, offset);
        offset += part.length;
      }
      const parsed = z
        .object({
          Status: z.literal(0),
          Answer: z
            .array(z.object({ type: z.number(), data: z.string().max(256) }))
            .max(32)
            .optional(),
        })
        .safeParse(JSON.parse(new TextDecoder().decode(bytes)));
      if (!parsed.success) throw new PolicyError("dns_unresolved");
      return (parsed.data.Answer ?? [])
        .filter((a) => a.type === 1 || a.type === 28)
        .map((a) => a.data);
    }),
  );
  return [...new Set(responses.flat())];
}

export function safeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (!["http:", "https:"].includes(u.protocol)) return "[non-http-url]";
    return (
      u.protocol +
      "//" +
      u.hostname +
      u.pathname
        .split("/")
        .map((p) => (p.length > 50 ? "[redacted]" : p))
        .join("/")
        .slice(0, 250)
    );
  } catch {
    return "[non-http-url]";
  }
}
export function safeMessage(text: string): string {
  return text
    .replace(/https?:\/\/[^\s)]+/gi, safeUrl)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\b[A-Za-z0-9_=-]{32,}\b/g, "[token]")
    .replace(/\b(?:\+?\d[\s().-]?){8,15}\b/g, "[phone]")
    .slice(0, 400);
}
