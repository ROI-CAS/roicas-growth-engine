import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fixture, validRequest } from "./helpers";
import {
  processDiagnostics,
  runPageSpeed,
  runDiagnosticAudit,
  reportHtml,
  reportSchema,
  reportText,
} from "../packages/core/diagnosis";
import { decrypt } from "../packages/core/crypto";
import type { Env } from "../packages/core/env";
const lighthouse = {
  lighthouseResult: {
    requestedUrl: "https://audit-example.com/",
    finalUrl: "https://audit-example.com/",
    fetchTime: "2026-10-15T12:00:00.000Z",
    categories: { performance: { score: 0.42 } },
    audits: {
      "largest-contentful-paint": { score: 0.1, numericValue: 4200 },
      "is-on-https": { score: 1 },
      "http-status-code": { score: 1 },
    },
  },
};
const providerSettings: Partial<Env> = {
  PUBLIC_DIAGNOSIS_ENABLED: "true",
  DIAGNOSIS_ENGINE: "pagespeed",
  DIAGNOSTIC_DELIVERY_ENABLED: "true",
  PAGESPEED_API_KEY: "fixture-google",
  BREVO_API_KEY: "fixture-brevo",
  EMAIL_FROM: "reportes@example.com",
  WHATSAPP_API_TOKEN: "fixture-meta",
  WHATSAPP_PHONE_NUMBER_ID: "12345678",
  WHATSAPP_API_VERSION: "v25.0",
  WHATSAPP_REPORT_TEMPLATE: "diagnostico_listo",
  WHATSAPP_TEMPLATE_LANGUAGE: "es",
};
describe("Procesamiento de diagnóstico y entrega", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  beforeAll(async () => {
    f = await fixture();
    Object.assign(f.env, providerSettings);
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  const create = async () => {
    const payload = validRequest({ website_url: "audit-example.com" });
    const r = await f.publicRequest("/api/v1/requests", payload);
    expect(r.status).toBe(202);
    return {
      payload,
      data: (await r.json()) as {
        request_id: string;
        diagnosis_id: string;
        dispatch_status: string;
      },
    };
  };
  it("inserta un único job en la transacción y conserva la idempotencia", async () => {
    const { payload, data } = await create();
    expect(data.diagnosis_id).toBe(data.request_id);
    expect(data.dispatch_status).toBe("queued");
    const retry = await f.publicRequest("/api/v1/requests", payload);
    expect(
      ((await retry.json()) as { diagnosis_id: string }).diagnosis_id,
    ).toBe(data.diagnosis_id);
    expect(
      (
        await f.db
          .prepare("SELECT COUNT(*) n FROM diagnosis_jobs WHERE id=?")
          .bind(data.diagnosis_id)
          .first<{ n: number }>()
      )?.n,
    ).toBe(1);
  });
  it("procesa dos cron concurrentes sin repetir el audit ni la entrega; cifra y limita acceso", async () => {
    const calls: string[] = [];
    const strategies: string[] = [];
    const upstream: typeof fetch = async (input, init) => {
      const url = new URL(String(input));
      calls.push(url.hostname);
      expect(init?.redirect).toBe("manual");
      if (url.hostname === "www.googleapis.com") {
        strategies.push(url.searchParams.get("strategy")!);
        return Response.json(lighthouse);
      }
      const body = JSON.parse(String(init?.body));
      if (url.hostname === "api.brevo.com") {
        expect(body.to).toEqual([{ email: "cliente@gmail.com" }]);
        expect(body.textContent).toContain("4200 ms");
        expect(body.headers.idempotencyKey).toMatch(/^[a-f0-9-]{36}$/);
        expect(new Headers(init?.headers).get("api-key")).toBe("fixture-brevo");
        return Response.json({ messageId: "email-1" });
      }
      expect(url.hostname).toBe("graph.facebook.com");
      expect(body.type).toBe("template");
      expect(body.to).toBe("573001234567");
      return Response.json({ messages: [{ id: "wa-1" }] });
    };
    await Promise.all([
      processDiagnostics(f.env, upstream),
      processDiagnostics(f.env, upstream),
    ]);
    expect(calls.filter((h) => h === "www.googleapis.com")).toHaveLength(2);
    expect(strategies.sort()).toEqual(["desktop", "mobile"]);
    expect(calls.filter((h) => h === "api.brevo.com")).toHaveLength(1);
    expect(calls.filter((h) => h === "graph.facebook.com")).toHaveLength(1);
    const row = await f.db
      .prepare(
        "SELECT id,report_encrypted,access_encrypted FROM diagnosis_jobs WHERE status='ready'",
      )
      .first<{
        id: string;
        report_encrypted: string;
        access_encrypted: string;
      }>();
    expect(row).toBeTruthy();
    expect(row!.report_encrypted).not.toContain("audit-example");
    const token = await decrypt(
      f.env.DATA_ENCRYPTION_KEY,
      row!.access_encrypted,
      `${row!.id}:report-token`,
    );
    const page = await f.publicRequest(`/informe/${token}`);
    expect(page.status).toBe(200);
    expect(await page.text()).toContain("42/100");
    expect(page.headers.get("cache-control")).toBe("no-store");
    expect(page.headers.get("x-robots-tag")).toContain("noindex");
    expect((await f.publicRequest(`/informe/${"x".repeat(43)}`)).status).toBe(
      404,
    );
    const admin = await f.adminRequest(
      `/api/v1/admin/leads/${row!.id}/diagnosis`,
    );
    expect(admin.status).toBe(200);
    expect(
      (
        (await admin.json()) as { deliveries: { status: string }[] }
      ).deliveries.every((d) => d.status === "accepted"),
    ).toBe(true);
    await f.db
      .prepare("UPDATE diagnosis_jobs SET expires_at=0 WHERE id=?")
      .bind(row!.id)
      .run();
    expect((await f.publicRequest(`/informe/${token}`)).status).toBe(404);
  });
  it("no reintenta WhatsApp cuando el resultado del envío es desconocido", async () => {
    const { data } = await create();
    let waCalls = 0;
    const upstream: typeof fetch = async (input) => {
      const url = new URL(String(input));
      if (url.hostname === "www.googleapis.com")
        return Response.json(lighthouse);
      if (url.hostname === "api.brevo.com")
        return Response.json({ messageId: "email-2" });
      waCalls++;
      throw new Error("network timeout after provider may have accepted");
    };
    await processDiagnostics(f.env, upstream);
    await processDiagnostics(f.env, upstream);
    expect(waCalls).toBe(1);
    expect(
      (
        await f.db
          .prepare(
            "SELECT status FROM report_deliveries WHERE diagnosis_id=? AND channel='whatsapp'",
          )
          .bind(data.diagnosis_id)
          .first<{ status: string }>()
      )?.status,
    ).toBe("unknown");
  });
  it("reintenta email con la misma clave y no vuelve a enviar WhatsApp aceptado", async () => {
    const { data } = await create();
    let emailCalls = 0;
    const keys: string[] = [];
    const upstream: typeof fetch = async (input, init) => {
      const u = new URL(String(input));
      if (u.hostname === "www.googleapis.com") return Response.json(lighthouse);
      if (u.hostname === "graph.facebook.com")
        return Response.json({ messages: [{ id: "wa-3" }] });
      emailCalls++;
      keys.push(JSON.parse(String(init?.body)).headers.idempotencyKey);
      return emailCalls === 1
        ? new Response(null, { status: 503 })
        : Response.json({ messageId: "email-3" });
    };
    // Isolate this scenario from other pending deliveries.
    await f.db
      .prepare(
        "UPDATE report_deliveries SET status='failed' WHERE status='queued'",
      )
      .run();
    await processDiagnostics(f.env, upstream);
    await f.db
      .prepare(
        "UPDATE report_deliveries SET available_at=0 WHERE diagnosis_id=? AND status='queued'",
      )
      .bind(data.diagnosis_id)
      .run();
    await processDiagnostics(f.env, upstream);
    expect(keys).toEqual([data.diagnosis_id, data.diagnosis_id]);
    expect(emailCalls).toBe(2);
  });
  it("bloquea trabajos y enlaces cuando el lead solicita no contacto", async () => {
    const { data } = await create();
    await f.db
      .prepare(
        "UPDATE leads SET commercial_status='solicita_no_contacto' WHERE id=?",
      )
      .bind(data.request_id)
      .run();
    let calls = 0;
    await processDiagnostics(f.env, async () => {
      calls++;
      throw new Error();
    });
    expect(calls).toBe(0);
    expect(
      (
        await f.db
          .prepare("SELECT status FROM diagnosis_jobs WHERE id=?")
          .bind(data.request_id)
          .first<{ status: string }>()
      )?.status,
    ).toBe("cancelled");
  });
  it("recupera un worker interrumpido sin repetir el WhatsApp incierto", async () => {
    const { data } = await create();
    const now = Math.floor(Date.now() / 1000);
    await f.db
      .prepare(
        "UPDATE diagnosis_jobs SET status='running',attempts=1,lease_until=0,lease_token='old' WHERE id=?",
      )
      .bind(data.diagnosis_id)
      .run();
    for (const channel of ["email", "whatsapp"])
      await f.db
        .prepare(
          "INSERT INTO report_deliveries(id,diagnosis_id,channel,status,available_at,lease_until,lease_token,first_attempt_at,updated_at) VALUES (?,?,?,'sending',0,0,'old',?,?)",
        )
        .bind(
          `${data.diagnosis_id}:${channel}`,
          data.diagnosis_id,
          channel,
          now - 1000,
          now,
        )
        .run();
    let whatsapps = 0,
      emails = 0;
    await processDiagnostics(f.env, async (input) => {
      const host = new URL(String(input)).hostname;
      if (host === "www.googleapis.com") return Response.json(lighthouse);
      if (host === "api.brevo.com") {
        emails++;
        return Response.json({ messageId: "recovered-email" });
      }
      whatsapps++;
      return Response.json({ messages: [{ id: "duplicate" }] });
    });
    expect(emails).toBe(1);
    expect(whatsapps).toBe(0);
    expect(
      (
        await f.db
          .prepare("SELECT status FROM report_deliveries WHERE id=?")
          .bind(`${data.diagnosis_id}:whatsapp`)
          .first<{ status: string }>()
      )?.status,
    ).toBe("unknown");
  });
  it("elimina el contenido de informes vencidos incluso con el diagnóstico pausado", async () => {
    const row = await f.db
      .prepare("SELECT id FROM diagnosis_jobs WHERE status='ready' LIMIT 1")
      .first<{ id: string }>();
    expect(row).toBeTruthy();
    await f.db
      .prepare("UPDATE diagnosis_jobs SET expires_at=0 WHERE id=?")
      .bind(row!.id)
      .run();
    f.env.PUBLIC_DIAGNOSIS_ENABLED = "false";
    await processDiagnostics(f.env, async () => {
      throw new Error("must not contact provider");
    });
    f.env.PUBLIC_DIAGNOSIS_ENABLED = "true";
    expect(
      await f.db
        .prepare(
          "SELECT status,report_encrypted,access_encrypted FROM diagnosis_jobs WHERE id=?",
        )
        .bind(row!.id)
        .first(),
    ).toMatchObject({
      status: "cancelled",
      report_encrypted: null,
      access_encrypted: "",
    });
  });
  it("concilia duplicate_parameter de Brevo sin confundirlo con entrega confirmada", async () => {
    const job = await f.db
      .prepare("SELECT id FROM diagnosis_jobs WHERE status='ready' LIMIT 1")
      .first<{ id: string }>();
    expect(job).toBeTruthy();
    const id = `${job!.id}:email`;
    await f.db
      .prepare(
        "UPDATE report_deliveries SET status='queued',attempts=0,available_at=0,first_attempt_at=? WHERE id=?",
      )
      .bind(Math.floor(Date.now() / 1000), id)
      .run();
    let calls = 0;
    await processDiagnostics(f.env, async (input) => {
      calls++;
      expect(new URL(String(input)).hostname).toBe("api.brevo.com");
      return Response.json({ code: "duplicate_parameter" }, { status: 400 });
    });
    expect(calls).toBe(1);
    expect(
      await f.db
        .prepare("SELECT status,error_code FROM report_deliveries WHERE id=?")
        .bind(id)
        .first(),
    ).toMatchObject({
      status: "unknown",
      error_code: "email_duplicate_reconcile",
    });
  });
  it("no reintenta Brevo fuera del margen de 25 minutos", async () => {
    const job = await f.db
      .prepare("SELECT id FROM diagnosis_jobs WHERE status='ready' LIMIT 1")
      .first<{ id: string }>();
    const id = `${job!.id}:email`;
    await f.db
      .prepare(
        "UPDATE report_deliveries SET status='queued',available_at=0,first_attempt_at=? WHERE id=?",
      )
      .bind(Math.floor(Date.now() / 1000) - 26 * 60, id)
      .run();
    let calls = 0;
    await processDiagnostics(f.env, async () => {
      calls++;
      throw new Error();
    });
    expect(calls).toBe(0);
    expect(
      await f.db
        .prepare("SELECT status,error_code FROM report_deliveries WHERE id=?")
        .bind(id)
        .first(),
    ).toMatchObject({
      status: "unknown",
      error_code: "idempotency_window_expired",
    });
  });
  it("cierra captación si faltan proveedores y no procesa en preview", async () => {
    const key = f.env.BREVO_API_KEY;
    f.env.BREVO_API_KEY = "";
    expect(
      (await f.publicRequest("/api/v1/requests", validRequest())).status,
    ).toBe(503);
    f.env.BREVO_API_KEY = key;
    const environment = f.env.ENVIRONMENT;
    f.env.ENVIRONMENT = "preview";
    let calls = 0;
    await processDiagnostics(f.env, async () => {
      calls++;
      throw new Error();
    });
    expect(calls).toBe(0);
    f.env.ENVIRONMENT = environment;
  });
});
describe("Proveedor fijo y resultados basados en evidencia", () => {
  it("usa el modo manual compatible con Workers y rechaza redirecciones del proveedor", async () => {
    await expect(
      runPageSpeed("audit-example.com", {} as Env, async (_input, init) => {
        expect(init?.redirect).toBe("manual");
        return new Response(null, {
          status: 302,
          headers: { Location: "https://other.example.com/" },
        });
      }),
    ).rejects.toThrow("pagespeed_http_302");
  });
  it("nunca navega la URL recibida desde nuestra infraestructura", async () => {
    const report = await runPageSpeed(
      "https://audit-example.com/ruta?secret=abc",
      {} as Env,
      async (input) => {
        const u = new URL(String(input));
        expect(u.origin + u.pathname).toBe(
          "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
        );
        expect(u.searchParams.get("url")).toBe("https://audit-example.com/");
        expect(u.searchParams.get("strategy")).toBe("mobile");
        expect(u.searchParams.get("fields")).toBe(
          "lighthouseResult(requestedUrl,finalUrl,fetchTime,runtimeError,categories/performance/score,audits)",
        );
        return Response.json({
          lighthouseResult: {
            ...lighthouse.lighthouseResult,
            audits: {
              ...lighthouse.lighthouseResult.audits,
              "network-requests": {
                score: 1,
                details: {
                  items: [
                    { url: "https://example.com/private?token=DO_NOT_STORE" },
                  ],
                },
              },
              "screenshot-thumbnails": {
                score: null,
                details: { data: "DO_NOT_STORE" },
              },
            },
          },
        });
      },
    );
    expect(report.performanceScore).toBe(42);
    expect(JSON.stringify(report)).not.toContain("DO_NOT_STORE");
    expect(
      report.metrics.find((m) => m.label.includes("CLS"))?.value,
    ).toBeNull();
    expect(
      report.observations.find((o) => o.label.includes("Consola"))?.state,
    ).toBe("no_verificado");
  });
  it("rechaza destinos internos, datos malformados y errores de navegación sin fabricar un diagnóstico", async () => {
    let calls = 0;
    await expect(
      runPageSpeed("http://127.0.0.1", {} as Env, async () => {
        calls++;
        return Response.json(lighthouse);
      }),
    ).rejects.toThrow();
    expect(calls).toBe(0);
    await expect(
      runPageSpeed("audit-example.com", {} as Env, async () =>
        Response.json({}),
      ),
    ).rejects.toThrow("pagespeed_invalid");
    await expect(
      runPageSpeed("audit-example.com", {} as Env, async () =>
        Response.json({
          lighthouseResult: {
            ...lighthouse.lighthouseResult,
            runtimeError: { code: "ERRORED_DOCUMENT_REQUEST" },
          },
        }),
      ),
    ).rejects.toThrow("pagespeed_navigation_failed");
  });
});
describe("Identidad de proxy", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  beforeAll(async () => {
    f = await fixture();
    f.env.TRUSTED_PROXY_REQUIRED = "true";
    f.env.PROXY_ORIGIN_SECRET = "a-secret-at-least-thirty-two-characters";
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  it("rechaza cabeceras reenviadas sin secreto y acepta solo el proxy autenticado", async () => {
    expect(
      (
        await f.publicRequest("/api/v1/requests", validRequest(), {
          "x-real-ip": "1.1.1.1",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await f.publicRequest("/api/v1/requests", validRequest(), {
          "x-real-ip": "1.1.1.1",
          "x-wpdoctor-proxy": "incorrect",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await f.publicRequest("/api/v1/requests", validRequest(), {
          "x-real-ip": "1.1.1.1",
          "x-wpdoctor-proxy": f.env.PROXY_ORIGIN_SECRET!,
        })
      ).status,
    ).toBe(202);
  });
});

describe("Rendimiento separado por dispositivo", () => {
  it("conserva puntuación, métricas y fecha de cada perfil, sin duplicar el resultado móvil", async () => {
    const report = await runDiagnosticAudit(
      "audit-example.com",
      "test",
      {} as Env,
      async (input) => {
        const pc =
          new URL(String(input)).searchParams.get("strategy") === "desktop";
        return Response.json({
          lighthouseResult: {
            ...lighthouse.lighthouseResult,
            fetchTime: pc
              ? "2026-10-16T13:00:00.000Z"
              : lighthouse.lighthouseResult.fetchTime,
            categories: { performance: { score: pc ? 0.35 : 0.42 } },
            audits: {
              "largest-contentful-paint": { numericValue: pc ? 6300 : 34000 },
            },
          },
        });
      },
    );
    expect(report.performanceScore).toBe(42);
    expect(report.desktop?.performanceScore).toBe(35);
    expect(report.desktop?.strategy).toBe("desktop");
    expect(report.desktop?.measuredAt).not.toBe(report.measuredAt);
    expect(report.desktop?.metrics[1]?.value).toBe(6300);
    expect(report.metrics[1]?.value).toBe(34000);
    expect(reportHtml(report)).toContain("Rendimiento PC: 35/100");
    expect(reportText(report, "https://example.com/report")).toContain(
      "6300 ms",
    );
    expect(reportSchema.parse(report).desktop).toEqual(report.desktop);
  });
  it("declara PC no medido ante fallo del proveedor y conserva el informe móvil", async () => {
    const report = await runDiagnosticAudit(
      "audit-example.com",
      "test",
      {} as Env,
      async (input) =>
        new URL(String(input)).searchParams.get("strategy") === "desktop"
          ? new Response(null, { status: 429 })
          : Response.json(lighthouse),
    );
    expect(report.performanceScore).toBe(42);
    expect(report.desktop).toBeUndefined();
    expect(report.desktopUnavailable).toBe(true);
    expect(reportHtml(report)).toContain("Rendimiento PC: No medido");
    expect(report.limits.join(" ")).toContain("PC no estuvo disponible");
  });
  it("lee informes antiguos sin inventar una medición PC", async () => {
    const report = await runPageSpeed(
      "audit-example.com",
      {} as Env,
      async () => Response.json(lighthouse),
    );
    expect(reportSchema.parse(report).desktop).toBeUndefined();
    expect(reportHtml(report)).toContain("Rendimiento PC: No medido");
  });
});
