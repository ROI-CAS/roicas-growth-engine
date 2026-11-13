import { describe, expect, it, vi } from "vitest";
import { PDFDocument } from "pdf-lib";
import { assessBrowserRun } from "../packages/core/browser-report";
import {
  reportHtml,
  reportSchema,
  runDiagnosticAudit,
  processDiagnostics,
} from "../packages/core/diagnosis";
import { diagnosisPdf } from "../packages/core/pdf";
import type { Env } from "../packages/core/env";
import { fixture, validRequest } from "./helpers";
import { decrypt } from "../packages/core/crypto";
import { N8N_WEBHOOK } from "../packages/core/n8n-dispatch";

const target = "https://audit-example.com/";
const profile = (name: "desktop" | "mobile") => ({
  profile: name,
  status: "completed",
  reason: null,
  http_status: 200,
  blocked: 0,
  screenshot_base64: "must-not-be-stored",
  evidence: [
    {
      kind: "javascript",
      url: target,
      message: "Cannot read properties of undefined",
    },
  ],
});
const run = () => ({
  target,
  policy_version: "runner-passive-v1",
  measured_at: "2026-10-16T12:00:00.000Z",
  status: "completed",
  browser_closed: true,
  profiles: [profile("desktop"), profile("mobile")],
});
const provider: typeof fetch = async () =>
  Response.json({
    lighthouseResult: {
      requestedUrl: target,
      finalUrl: target,
      fetchTime: "2026-10-16T11:00:00.000Z",
      categories: { performance: { score: 0.99 } },
      audits: {},
    },
  });

describe("Evidencias del navegador en el diagnóstico", () => {
  it("no duplica un HTTP fallido ni atribuye los mensajes genéricos de sus bloqueos a la web", () => {
    const input = run();
    const p = {
      ...profile("desktop"),
      blocked: 1,
      evidence: [
        {
          kind: "http",
          url: target + "font.woff2",
          message: "http_response",
          status: 404,
        },
        {
          kind: "transport",
          url: target + "font.woff2",
          message: "net::ERR_ABORTED",
        },
        {
          kind: "console",
          url: target,
          message:
            "Failed to load resource: the server responded with a status of 404 ()",
        },
        {
          kind: "console",
          url: target,
          message: "Failed to load resource: net::ERR_FAILED",
        },
        { kind: "console", url: target, message: "Missing expected form" },
      ],
    };
    const assessment = assessBrowserRun({ ...input, profiles: [p] }, target);
    expect(assessment.findings.map((f) => f.category)).toEqual([
      "http",
      "console",
    ]);
    expect(assessment.findings[1]?.evidence).toBe("Missing expected form");
    expect(assessment.coverageLimited).toBe(true);
  });
  it("guarda cifrado el resultado integrado y lo sirve en PDF y al propietario", async () => {
    const f = await fixture();
    try {
      Object.assign(f.env, {
        ENVIRONMENT: "staging",
        PUBLIC_DIAGNOSIS_ENABLED: "true",
        DIAGNOSIS_ENGINE: "pagespeed",
        PAGESPEED_API_KEY: "fixture-google",
        BROWSER_DIAGNOSTICS_MODE: "laboratory",
        BROWSER_RUNNER: { run: async () => run() },
        DELIVERY_MODE: "n8n_pdf_whatsapp",
        DIAGNOSTIC_DELIVERY_ENABLED: "true",
        N8N_DISPATCH_WEBHOOK_URL: N8N_WEBHOOK,
        N8N_SEND_ENABLED: "true",
        N8N_DOCUMENT_TEMPLATE_NAME: "fixture_report",
        N8N_TEMPLATE_LANGUAGE: "es",
      });
      const response = await f.publicRequest(
        "/api/v1/requests",
        validRequest({ website_url: target }),
      );
      expect(response.status).toBe(202);
      const { diagnosis_id: id } = (await response.json()) as {
        diagnosis_id: string;
      };
      await processDiagnostics(f.env, async (input, init) => {
        if (new URL(String(input)).hostname === "www.googleapis.com")
          return provider(input, init);
        expect(String(input)).toBe(N8N_WEBHOOK);
        return Response.json({ accepted: true, provider_id: "fixture-wa" });
      });
      const row = await f.db
        .prepare(
          "SELECT status,report_encrypted,access_encrypted FROM diagnosis_jobs WHERE id=?",
        )
        .bind(id)
        .first<{
          status: string;
          report_encrypted: string;
          access_encrypted: string;
        }>();
      expect(row?.status).toBe("ready");
      expect(row?.report_encrypted).not.toContain("Cannot read properties");
      const stored = JSON.parse(
        await decrypt(
          f.env.DATA_ENCRYPTION_KEY,
          row!.report_encrypted,
          `${id}:report`,
        ),
      );
      expect(stored.browser.findings[0].category).toBe("javascript");
      expect(JSON.stringify(stored)).not.toContain("must-not-be-stored");
      const token = await decrypt(
        f.env.DATA_ENCRYPTION_KEY,
        row!.access_encrypted,
        `${id}:report-token`,
      );
      const pdf = await f.publicRequest(`/informe/${token}.pdf`);
      expect(pdf.status).toBe(200);
      expect(pdf.headers.get("content-type")).toBe("application/pdf");
      expect(
        (await PDFDocument.load(await pdf.arrayBuffer())).getPageCount(),
      ).toBeGreaterThan(1);
      const admin = await f.adminRequest(`/api/v1/admin/leads/${id}/diagnosis`);
      expect(admin.status).toBe(200);
      expect(
        (
          (await admin.json()) as {
            diagnosis: { report: { browser: unknown } };
          }
        ).diagnosis.report.browser,
      ).toBeTruthy();
    } finally {
      await f.mf.dispose();
    }
  });
  it("agrupa un mismo error por perfiles, conserva la fecha propia y excluye capturas", () => {
    const browser = assessBrowserRun(run(), target);
    expect(browser.findings).toHaveLength(1);
    expect(browser.findings[0]?.profiles).toEqual(["desktop", "mobile"]);
    expect(browser.findings[0]?.assessment).toBe("observado");
    expect(browser.measuredAt).toBe("2026-10-16T12:00:00.000Z");
    expect(JSON.stringify(browser)).not.toContain("must-not-be-stored");
    expect(browser.limitations.join(" ")).toContain(
      "no una confirmación de causa",
    );
  });
  it("no atribuye a la web un fallo de conexión provocado por su política", () => {
    const input = run();
    for (const p of input.profiles) {
      p.blocked = 1;
      p.evidence = [
        {
          kind: "transport",
          url: target + "blocked.js",
          message: "net::ERR_FAILED",
        },
        {
          kind: "blocked",
          url: target + "blocked.js",
          message: "redirect_denied",
        },
      ];
    }
    const browser = assessBrowserRun(input, target);
    expect(browser.findings).toEqual([]);
    expect(browser.coverageLimited).toBe(true);
  });
  it("conserva fallos HTTP reales y no convierte una respuesta correcta en alerta", () => {
    const input = run();
    const p = input.profiles[0]!;
    p.evidence = [];
    const entries = [
      {
        kind: "http",
        url: target + "missing.js",
        message: "http_response",
        status: 404,
      },
      {
        kind: "http",
        url: target + "ok.js",
        message: "http_response",
        status: 200,
      },
    ];
    const browser = assessBrowserRun(
      { ...input, profiles: [{ ...p, evidence: entries }] },
      target,
    );
    expect(browser.findings).toHaveLength(1);
    expect(browser.findings[0]?.evidence).toBe("HTTP 404");
    expect(browser.coverageLimited).toBe(true);
  });
  it("redacta credenciales, consultas y datos de contacto en evidencias", () => {
    const input = run();
    for (const p of input.profiles)
      p.evidence = [
        {
          kind: "console",
          url: "https://user:password@audit-example.com/script.js?token=secret#fragment",
          message:
            "cliente@example.com https://audit-example.com/file?token=secret",
        },
      ];
    const serialized = JSON.stringify(assessBrowserRun(input, target));
    for (const secret of [
      "password",
      "token=secret",
      "cliente@example.com",
      "fragment",
    ])
      expect(serialized).not.toContain(secret);
  });
  it("rechaza otro dominio, perfiles duplicados y resultados sin contrato válido", () => {
    expect(() => assessBrowserRun(run(), "https://other.example/")).toThrow(
      "browser_target_mismatch",
    );
    expect(() =>
      assessBrowserRun(
        { ...run(), profiles: [profile("mobile"), profile("mobile")] },
        target,
      ),
    ).toThrow("browser_duplicate_profiles");
    expect(() =>
      assessBrowserRun({ status: "rejected", reason: "runner_busy" }, target),
    ).toThrow();
  });
  it("un perfil fallido o un cierre incierto impiden presentar cobertura completa", () => {
    expect(
      assessBrowserRun({ ...run(), browser_closed: false }, target)
        .coverageLimited,
    ).toBe(true);
    expect(
      assessBrowserRun(
        {
          ...run(),
          profiles: [
            { ...profile("mobile"), status: "failed", http_status: null },
          ],
        },
        target,
      ).coverageLimited,
    ).toBe(true);
  });
  it("combina PageSpeed y RPC privado y produce HTML y PDF con evidencias", async () => {
    const rpc = vi.fn(async () => run());
    const report = await runDiagnosticAudit(
      target,
      "d410e193-dfcb-4185-a307-1ea44d510a0d",
      {
        ENVIRONMENT: "staging",
        BROWSER_DIAGNOSTICS_MODE: "laboratory",
        BROWSER_RUNNER: { run: rpc },
      } as unknown as Env,
      provider,
    );
    expect(rpc).toHaveBeenCalledWith({
      job_id: "d410e193-dfcb-4185-a307-1ea44d510a0d",
      target,
    });
    expect(report.performanceScore).toBe(99);
    expect(report.browser?.findings[0]?.category).toBe("javascript");
    expect(report.measuredAt).not.toBe(report.browser?.measuredAt);
    expect(reportHtml(report)).toContain("Excepción JavaScript");
    const pdf = await PDFDocument.load(await diagnosisPdf(report));
    expect(pdf.getPageCount()).toBeGreaterThan(1);
    expect(reportSchema.parse(report).browser?.findings).toHaveLength(1);
  });
  it("inicia navegador y rendimiento en paralelo y corta un RPC que no responde antes de dos minutos", async () => {
    vi.useFakeTimers();
    try {
      const rpc = vi.fn(() => new Promise<never>(() => {}));
      const fetcher = vi.fn(provider);
      const task = runDiagnosticAudit(
        target,
        "deadline",
        {
          ENVIRONMENT: "staging",
          BROWSER_DIAGNOSTICS_MODE: "laboratory",
          BROWSER_RUNNER: { run: rpc },
        } as unknown as Env,
        fetcher,
      );
      const rejected = expect(task).rejects.toThrow("browser_deadline");
      expect(rpc).toHaveBeenCalledTimes(1);
      expect(fetcher).toHaveBeenCalledTimes(2);
      await vi.advanceTimersByTimeAsync(95000);
      await rejected;
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it("mantiene el cierre del escáner en producción aunque exista binding", async () => {
    const rpc = vi.fn();
    const fetcher = vi.fn(provider);
    await expect(
      runDiagnosticAudit(
        target,
        "unused",
        {
          ENVIRONMENT: "production",
          BROWSER_DIAGNOSTICS_MODE: "laboratory",
          BROWSER_RUNNER: { run: rpc },
        } as unknown as Env,
        fetcher,
      ),
    ).rejects.toThrow("browser_security_gate_closed");
    expect(rpc).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("un runner rechazado no produce un informe aparentemente limpio", async () => {
    await expect(
      runDiagnosticAudit(
        target,
        "unused",
        {
          ENVIRONMENT: "staging",
          BROWSER_DIAGNOSTICS_MODE: "laboratory",
          BROWSER_RUNNER: {
            run: async () => ({
              status: "rejected",
              reason: "target_not_approved",
            }),
          },
        } as unknown as Env,
        provider,
      ),
    ).rejects.toThrow("browser_result_unavailable");
  });
  it("los informes PageSpeed anteriores se mantienen compatibles sin navegador", async () => {
    const report = await runDiagnosticAudit(
      target,
      "unused",
      { ENVIRONMENT: "production" } as Env,
      provider,
    );
    expect(report.browser).toBeUndefined();
    expect(reportHtml(report)).not.toContain("Revisión del navegador");
  });
  it("escapa HTML hostil procedente de la consola", async () => {
    const input = run();
    input.profiles[0]!.evidence[0]!.message = '<script>alert("test")</script>';
    const report = await runDiagnosticAudit(
      target,
      "unused",
      { ENVIRONMENT: "staging" } as Env,
      provider,
    );
    report.browser = assessBrowserRun(input, target);
    expect(reportHtml(report)).not.toContain('<script>alert("test")</script>');
    expect(reportHtml(report)).toContain("&lt;script&gt;");
  });
});
