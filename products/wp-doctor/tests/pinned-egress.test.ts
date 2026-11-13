import { describe, it, expect } from "vitest";
import { pinnedFetch } from "../packages/isolated-runner/pinned-fetch";
const budget = () => ({
  remaining: 5 * 1024 * 1024,
  requests: 0,
  deadline: Date.now() + 5000,
});
describe("Transporte DNS fijado: rechazo antes de abrir TCP", () => {
  it.each([
    "127.0.0.1",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "0.0.0.0",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])("rechaza la dirección %s sin conectar", async (ip) => {
    await expect(
      pinnedFetch(
        "https://site.example/",
        "GET",
        "site.example",
        budget(),
        async () => [ip],
      ),
    ).rejects.toMatchObject({ code: "dns_non_public" });
  });
  it("rechaza DNS mixto y vacío; no elige solamente la respuesta que conviene", async () => {
    await expect(
      pinnedFetch(
        "https://site.example/",
        "GET",
        "site.example",
        budget(),
        async () => ["8.8.8.8", "127.0.0.1"],
      ),
    ).rejects.toMatchObject({ code: "dns_non_public" });
    await expect(
      pinnedFetch(
        "https://site.example/",
        "GET",
        "site.example",
        budget(),
        async () => [],
      ),
    ).rejects.toMatchObject({ code: "dns_non_public" });
  });
  it.each([
    ["https://site.example/", "POST"],
    ["https://other.example/", "GET"],
    ["https://site.example:8443/", "GET"],
    ["https://person:secret@site.example/", "GET"],
    ["https://site.example/wp-admin/", "GET"],
    ["https://site.example/?add-to-cart=1", "GET"],
    ["file:///etc/passwd", "GET"],
  ])(
    "no consulta DNS para el contrato prohibido %s %s",
    async (url, method) => {
      let queries = 0;
      await expect(
        pinnedFetch(url!, method!, "site.example", budget(), async () => {
          queries++;
          return ["127.0.0.1"];
        }),
      ).rejects.toThrow();
      expect(queries).toBe(0);
    },
  );
  it("no abre conexión al agotar bytes, tiempo o número de peticiones", async () => {
    await expect(
      pinnedFetch(
        "https://site.example/",
        "GET",
        "site.example",
        { ...budget(), remaining: 0 },
        async () => ["8.8.8.8"],
      ),
    ).rejects.toMatchObject({ code: "transfer_budget" });
    await expect(
      pinnedFetch(
        "https://site.example/",
        "GET",
        "site.example",
        { ...budget(), requests: 80 },
        async () => ["8.8.8.8"],
      ),
    ).rejects.toMatchObject({ code: "request_budget" });
    await expect(
      pinnedFetch(
        "https://site.example/",
        "GET",
        "site.example",
        { ...budget(), deadline: Date.now() - 1 },
        async () => ["8.8.8.8"],
      ),
    ).rejects.toMatchObject({ code: "deadline" });
  });
});
