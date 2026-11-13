import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { fixture, validRequest } from "./helpers";
import {
  checkout,
  paymentForOffer,
  paymentPage,
  paymentStatus,
  paymentsConfigured,
  sha256,
  wompiWebhook,
} from "../packages/core/payments";
import { proxyRequest } from "../api/proxy";

describe("Wompi: cotización revisada y confirmación de servidor", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  let lead: string;
  let offer: string;
  let token: string;
  beforeAll(async () => {
    f = await fixture();
    Object.assign(f.env, {
      WOMPI_ENABLED: "true",
      WOMPI_ENVIRONMENT: "test",
      WOMPI_PUBLIC_KEY: "pub_test_fixture",
      WOMPI_PRIVATE_KEY: "prv_test_fixture",
      WOMPI_INTEGRITY_SECRET: "test_integrity_fixture",
      WOMPI_EVENTS_SECRET: "test_events_fixture",
    });
    lead = (
      (await (
        await f.publicRequest("/api/v1/requests", validRequest())
      ).json()) as { request_id: string }
    ).request_id;
    const res = await f.adminRequest(
      `/api/v1/admin/leads/${lead}/offers`,
      "POST",
      {
        idempotency_key: crypto.randomUUID(),
        service_type: "reparacion",
        scope_summary: "Corregir el error público delimitado de carga.",
        exclusions: "No incluye rediseño ni licencias de terceros.",
        quoted_price_cop: 229000,
        status: "enviada",
      },
    );
    offer = ((await res.json()) as { id: string }).id;
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  const req = (path: string, body: unknown) =>
    new Request(`https://public.example.com${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://public.example.com",
      },
      body: JSON.stringify(body),
    });
  it("crea una sola orden por oferta, conserva monto del servidor y exige aceptación explícita", async () => {
    const first = (await (
      await paymentForOffer(f.env, offer, "owner")
    ).json()) as { payment_url: string };
    const second = (await (
      await paymentForOffer(f.env, offer, "owner")
    ).json()) as { payment_url: string };
    expect(second.payment_url).toBe(first.payment_url);
    token = first.payment_url.split("/").pop()!;
    const page = await paymentPage(
      new Request(first.payment_url),
      f.env,
      token,
    );
    const html = await page.text();
    expect(html).toContain("229.000");
    expect(html).toContain("Corregir el error público");
    expect(html).not.toContain("test_integrity_fixture");
    expect(html).not.toContain("required checked");
    await expect(
      checkout(
        req("/api/v1/payments/checkout", { token, accepted: false }),
        f.env,
      ),
    ).rejects.toMatchObject({ status: 422 });
    const result = (await (
      await checkout(
        req("/api/v1/payments/checkout", {
          token,
          accepted: true,
          amount_in_cents: 1,
        }),
        f.env,
      )
    ).json()) as { checkout_url: string };
    const url = new URL(result.checkout_url);
    expect(url.origin).toBe("https://checkout.wompi.co");
    expect(url.searchParams.get("amount-in-cents")).toBe("22900000");
    expect(url.searchParams.get("signature:integrity")).toBe(
      await sha256(
        `${url.searchParams.get("reference")}22900000COP${url.searchParams.get("expiration-time")}test_integrity_fixture`,
      ),
    );
  });
  it("no confirma por redirección, rechaza firma/importe/capacidad ajena y procesa reintentos sin duplicar", async () => {
    const order = await f.db
      .prepare("SELECT * FROM payment_orders WHERE offer_id=?")
      .bind(offer)
      .first<{ reference: string; id: string }>();
    const tx = {
      id: "123-test-456",
      reference: order!.reference,
      status: "APPROVED",
      amount_in_cents: 22900000,
      currency: "COP",
    };
    let calls = 0;
    const upstream: typeof fetch = async (input, init) => {
      calls++;
      expect(String(input)).toBe(
        "https://sandbox.wompi.co/v1/transactions/123-test-456",
      );
      expect(new Headers(init?.headers).get("Authorization")).toBe(
        "Bearer prv_test_fixture",
      );
      return Response.json({ data: tx });
    };
    const timestamp = Math.floor(Date.now() / 1000);
    const properties = [
      "transaction.id",
      "transaction.status",
      "transaction.amount_in_cents",
    ];
    const event = {
      event: "transaction.updated",
      environment: "test",
      data: { transaction: tx },
      timestamp,
      signature: {
        properties,
        checksum: await sha256(
          `${tx.id}${tx.status}${tx.amount_in_cents}${timestamp}test_events_fixture`,
        ),
      },
    };
    await expect(
      wompiWebhook(
        req("/events", {
          ...event,
          signature: { properties, checksum: "a".repeat(64) },
        }),
        f.env,
        upstream,
      ),
    ).rejects.toMatchObject({ status: 403 });
    expect(calls).toBe(0);
    await expect(
      wompiWebhook(req("/events", event), f.env, async () =>
        Response.json({ data: { ...tx, amount_in_cents: 1000 } }),
      ),
    ).rejects.toMatchObject({ status: 409 });
    expect(
      (await f.db
        .prepare("SELECT status FROM payment_orders WHERE id=?")
        .bind(order!.id)
        .first<{ status: string }>())!.status,
    ).toBe("CREATED");
    await expect(
      paymentStatus(
        req("/status", { token, transaction_id: tx.id }),
        f.env,
        async () => Response.json({ data: { ...tx, reference: "OTHER" } }),
      ),
    ).rejects.toMatchObject({ status: 404 });
    expect(
      (await wompiWebhook(req("/events", event), f.env, upstream)).status,
    ).toBe(200);
    expect(
      (await wompiWebhook(req("/events", event), f.env, upstream)).status,
    ).toBe(200);
    expect(
      (await f.db
        .prepare("SELECT COUNT(*) AS n FROM payment_events")
        .first<{ n: number }>())!.n,
    ).toBe(1);
    expect(
      (
        (await (
          await paymentStatus(req("/status", { token }), f.env, upstream)
        ).json()) as { status: string }
      ).status,
    ).toBe("APPROVED");
    await expect(
      checkout(req("/checkout", { token, accepted: true }), f.env),
    ).rejects.toMatchObject({ status: 409 });
    expect(
      (await f.db
        .prepare(
          "SELECT COUNT(*) AS n FROM audit_log WHERE action='payment.approved'",
        )
        .first<{ n: number }>())!.n,
    ).toBe(1);
  });
  it("cierra pagos sin llaves y evita mezclar sandbox con producción", () => {
    expect(paymentsConfigured(f.env)).toBe(true);
    expect(paymentsConfigured({ ...f.env, WOMPI_PRIVATE_KEY: "" })).toBe(false);
    expect(paymentsConfigured({ ...f.env, ENVIRONMENT: "production" })).toBe(
      false,
    );
  });
});

describe("Proxy Vercel: ruta fija, secreto e IP de plataforma", () => {
  const secret = "x".repeat(64);
  it("reconstruye cabeceras sin propagar identidad o secreto aportados por el cliente", async () => {
    const r = new Request(
      "https://doctor.roicas.com/api/proxy?wpdoctor_path=requests",
      {
        method: "POST",
        headers: {
          Origin: "https://doctor.roicas.com",
          "x-vercel-forwarded-for": "203.0.113.8",
          "x-real-ip": "127.0.0.1",
          "x-wpdoctor-proxy": "fake",
          Authorization: "fake",
          "Cf-Access-Jwt-Assertion": "fake",
          "Content-Type": "application/json",
        },
        body: "{}",
      },
    );
    const response = await proxyRequest(r, secret, async (input, init) => {
      expect(String(input)).toBe(
        "https://webexpress-wp-doctor.casinmiedo.workers.dev/api/v1/requests",
      );
      const h = new Headers(init?.headers);
      expect(h.get("x-wpdoctor-proxy")).toBe(secret);
      expect(h.get("x-real-ip")).toBe("203.0.113.8");
      expect(h.has("authorization")).toBe(false);
      expect(h.has("Cf-Access-Jwt-Assertion")).toBe(false);
      return Response.json({ ok: true });
    });
    expect(response.status).toBe(200);
  });
  it("rechaza rutas arbitrarias, origen ajeno, falta de secreto y cuerpo excesivo", async () => {
    expect(
      (
        await proxyRequest(
          new Request(
            "https://doctor.roicas.com/api/proxy?wpdoctor_path=https://localhost",
          ),
          secret,
        )
      ).status,
    ).toBe(404);
    expect(
      (
        await proxyRequest(
          new Request(
            "https://doctor.roicas.com/api/proxy?wpdoctor_path=public/config",
          ),
          undefined,
        )
      ).status,
    ).toBe(503);
    expect(
      (
        await proxyRequest(
          new Request(
            "https://doctor.roicas.com/api/proxy?wpdoctor_path=requests",
            { method: "POST", headers: { Origin: "https://evil.example" } },
          ),
          secret,
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await proxyRequest(
          new Request(
            "https://doctor.roicas.com/api/proxy?wpdoctor_path=requests",
            {
              method: "POST",
              headers: {
                Origin: "https://doctor.roicas.com",
                "x-vercel-forwarded-for": "203.0.113.8",
              },
              body: "x".repeat(17000),
            },
          ),
          secret,
        )
      ).status,
    ).toBe(413);
  });
});
