import { describe, it, expect } from "vitest";
import {
  approvedHosts,
  NetworkPolicy,
  publicAddress,
  resolvePublicDns,
  safeMessage,
  targetHomepage,
} from "../packages/runner/policy";
describe("Política SSRF del runner", () => {
  it.each([
    "127.0.0.1",
    "0.0.0.0",
    "10.0.0.1",
    "172.16.1.1",
    "192.168.0.1",
    "169.254.169.254",
    "100.64.0.1",
    "192.0.2.1",
    "198.18.0.1",
    "224.0.0.1",
    "255.255.255.255",
    "::1",
    "::",
    "fc00::1",
    "fe80::1",
    "ff02::1",
    "::ffff:127.0.0.1",
    "::ffff:8.8.8.8",
    "2001:db8::1",
  ])("rechaza rango no público %s", (ip) =>
    expect(publicAddress(ip)).toBe(false),
  );
  it("acepta IP públicas y solo hosts aprobados exactos", () => {
    expect(publicAddress("8.8.8.8")).toBe(true);
    expect(publicAddress("2001:4860:4860::8888")).toBe(true);
    expect(
      targetHomepage("https://example.com/", approvedHosts('["example.com"]')),
    ).toBe("https://example.com/");
    for (const target of [
      "https://example.com/private",
      "https://example.com/?secret=x",
      "http://example.com/",
      "https://evilexample.com/",
      "https://example.com:443/",
      "https://example.com@evil.com/",
    ])
      expect(() => targetHomepage(target, ["example.com"])).toThrow();
    expect(() => approvedHosts('["*.example.com"]')).toThrow();
  });
  it.each([
    "http://127.1/",
    "http://2130706433/",
    "http://0x7f000001/",
    "http://[::1]/",
    "http://example.com:443/",
    "https://user:pass@example.com/",
    "file:///etc/passwd",
    "ftp://example.com/",
    "ws://example.com/",
    "https://example.com.evil.com/",
  ])("bloquea %s antes de resolver", async (url) => {
    let calls = 0;
    const policy = new NetworkPolicy(
      "example.com",
      async () => {
        calls++;
        return ["8.8.8.8"];
      },
      Date.now() + 10000,
    );
    await expect(policy.check(url)).rejects.toThrow();
    expect(calls).toBe(0);
  });
  it("revalida DNS y rechaza cambios a privado, familias mixtas y fallos", async () => {
    let n = 0;
    const policy = new NetworkPolicy(
      "example.com",
      async () => (++n === 1 ? ["8.8.8.8"] : ["127.0.0.1"]),
      Date.now() + 10000,
    );
    await policy.check("https://example.com/");
    await expect(policy.check("https://example.com/script.js")).rejects.toThrow(
      "dns_non_public",
    );
    for (const ips of [[], ["8.8.8.8", "::1"]])
      await expect(
        new NetworkPolicy(
          "example.com",
          async () => ips,
          Date.now() + 10000,
        ).check("https://example.com/"),
      ).rejects.toThrow();
  });
  it("bloquea mutaciones, redirecciones excesivas y agotamiento", async () => {
    const policy = new NetworkPolicy(
      "example.com",
      async () => ["8.8.8.8"],
      Date.now() + 10000,
    );
    await expect(policy.check("https://example.com/", "POST")).rejects.toThrow(
      "method",
    );
    for (const url of [
      "https://example.com/wp-admin/admin-ajax.php",
      "https://example.com/?add-to-cart=1",
      "https://example.com/checkout",
    ])
      await expect(
        new NetworkPolicy(
          "example.com",
          async () => {
            throw new Error("DNS must not run");
          },
          Date.now() + 10000,
        ).check(url),
      ).rejects.toThrow("active_endpoint");
    await expect(
      policy.check("https://example.com/", "GET", 4),
    ).rejects.toThrow("redirect_budget");
    await expect(
      new NetworkPolicy("example.com", async () => ["8.8.8.8"], 0).check(
        "https://example.com/",
      ),
    ).rejects.toThrow("deadline");
    for (let n = 0; n < 38; n++) await policy.check("https://example.com/");
    await expect(policy.check("https://example.com/")).rejects.toThrow(
      "request_budget",
    );
  });
  it("DoH solo usa endpoint fijo, ambas familias y falla cerrado", async () => {
    const ips = await resolvePublicDns("example.com", async (input, init) => {
      const url = new URL(String(input));
      expect(url.origin).toBe("https://cloudflare-dns.com");
      expect(init?.redirect).toBe("manual");
      return Response.json({
        Status: 0,
        Answer: [
          { type: 5, data: "alias.example.com" },
          {
            type: Number(url.searchParams.get("type")),
            data:
              url.searchParams.get("type") === "1"
                ? "8.8.8.8"
                : "2001:4860:4860::8888",
          },
        ],
      });
    });
    expect(ips).toHaveLength(2);
    await expect(
      resolvePublicDns(
        "example.com",
        async () => new Response(null, { status: 302 }),
      ),
    ).rejects.toThrow("dns_unavailable");
    await expect(
      resolvePublicDns("example.com", async () => Response.json({ Status: 3 })),
    ).rejects.toThrow("dns_unresolved");
  });
  it("sanea evidencia sin query, email ni tokens", () => {
    const message = safeMessage(
      "error https://example.com/path?token=SECRET persona@example.com " +
        "x".repeat(43),
    );
    expect(message).not.toContain("SECRET");
    expect(message).not.toContain("persona@");
    expect(message).not.toContain("x".repeat(43));
  });
});
