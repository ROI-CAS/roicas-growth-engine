import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mkdir, writeFile } from "node:fs/promises";
import { fixture, validRequest } from "./helpers";
import { processDiagnostics, runPageSpeed } from "../packages/core/diagnosis";
import { diagnosisPdf } from "../packages/core/pdf";
import { decrypt } from "../packages/core/crypto";
import { N8N_WEBHOOK } from "../packages/core/n8n-dispatch";

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
describe("Entrega PDF aislada mediante n8n", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  beforeAll(async () => {
    f = await fixture("https://doctor.roicas.com");
    Object.assign(f.env, {
      PUBLIC_DIAGNOSIS_ENABLED: "true",
      DIAGNOSIS_ENGINE: "pagespeed",
      DIAGNOSTIC_DELIVERY_ENABLED: "true",
      PAGESPEED_API_KEY: "fixture-google",
      DELIVERY_MODE: "n8n_pdf_whatsapp",
      N8N_DISPATCH_WEBHOOK_URL: N8N_WEBHOOK,
      N8N_SEND_ENABLED: "true",
      N8N_DOCUMENT_TEMPLATE_NAME: "fixture_document",
      N8N_TEMPLATE_LANGUAGE: "es",
    });
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  const create = async () => {
    const response = await f.publicRequest(
      "/api/v1/requests",
      validRequest({
        website_url: "audit-example.com",
        contact: { whatsapp_phone: "+573001234567" },
      }),
    );
    expect(response.status).toBe(202);
    return (await response.json()) as { request_id: string };
  };
  it("acepta sin correo y entrega solo WhatsApp con autorización de un uso y PDF privado", async () => {
    const { request_id: id } = await create();
    const lead = await f.db
      .prepare("SELECT email_encrypted,email_domain_type FROM leads WHERE id=?")
      .bind(id)
      .first<{ email_encrypted: string; email_domain_type: string }>();
    expect(lead?.email_domain_type).toBe("not_provided");
    expect(
      await decrypt(
        f.env.DATA_ENCRYPTION_KEY,
        lead!.email_encrypted,
        `${id}:email`,
      ),
    ).toBe("");
    let calls = 0,
      pdfPath = "";
    const upstream: typeof fetch = async (input, init) => {
      if (new URL(String(input)).hostname === "www.googleapis.com")
        return Response.json(lighthouse);
      expect(String(input)).toBe(N8N_WEBHOOK);
      expect(init?.redirect).toBe("manual");
      calls++;
      const body = JSON.parse(String(init?.body));
      expect(body.dry_run).toBe(false);
      const capability = { delivery_id: body.delivery_id, token: body.token };
      const claim = await f.publicRequest("/api/v1/dispatch/claim", capability);
      expect(claim.status).toBe(200);
      const authorized = (await claim.json()) as {
        authorized: boolean;
        business_phone_number_id: string;
        payload: {
          to: string;
          template: {
            components: { parameters: { document?: { link: string } }[] }[];
          };
        };
      };
      expect(authorized.authorized).toBe(true);
      expect(authorized.business_phone_number_id).toBe("1007628075756742");
      expect(authorized.payload.to).toBe("573001234567");
      pdfPath = new URL(
        authorized.payload.template.components[0]!.parameters[0]!.document!
          .link,
      ).pathname;
      expect(pdfPath).toMatch(/^\/informe\/[A-Za-z0-9_-]{43}\.pdf$/);
      expect(
        (await f.publicRequest("/api/v1/dispatch/claim", capability)).status,
      ).toBe(409);
      const response = await f.publicRequest(pdfPath);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("application/pdf");
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.get("x-robots-tag")).toContain("noindex");
      const bytes = new Uint8Array(await response.arrayBuffer());
      expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe("%PDF");
      expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThan(0);
      return Response.json({
        accepted: true,
        provider_id: "wamid.fixture-n8n",
      });
    };
    await Promise.all([
      processDiagnostics(f.env, upstream),
      processDiagnostics(f.env, upstream),
    ]);
    expect(calls).toBe(1);
    expect(
      (
        await f.db
          .prepare(
            "SELECT channel,status,provider_id FROM report_deliveries WHERE diagnosis_id=?",
          )
          .bind(id)
          .all()
      ).results,
    ).toEqual([
      {
        channel: "whatsapp",
        status: "accepted",
        provider_id: "wamid.fixture-n8n",
      },
    ]);
    await f.db
      .prepare(
        "UPDATE leads SET commercial_status='solicita_no_contacto' WHERE id=?",
      )
      .bind(id)
      .run();
    expect((await f.publicRequest(pdfPath)).status).toBe(404);
  });
  it("no reintenta envíos inciertos ni acepta campos que elijan destinatario", async () => {
    const { request_id: id } = await create();
    let calls = 0;
    const upstream: typeof fetch = async (input) => {
      if (new URL(String(input)).hostname === "www.googleapis.com")
        return Response.json(lighthouse);
      calls++;
      throw new Error("Resultado incierto de n8n");
    };
    await processDiagnostics(f.env, upstream);
    await processDiagnostics(f.env, upstream);
    expect(calls).toBe(1);
    expect(
      await f.db
        .prepare("SELECT status FROM report_deliveries WHERE diagnosis_id=?")
        .bind(id)
        .first(),
    ).toMatchObject({ status: "unknown" });
    const fake = { delivery_id: `${id}:whatsapp`, token: "x".repeat(43) };
    expect((await f.publicRequest("/api/v1/dispatch/claim", fake)).status).toBe(
      409,
    );
    expect(
      (
        await f.publicRequest("/api/v1/dispatch/claim", {
          ...fake,
          phone: "573114565403",
        })
      ).status,
    ).toBe(422);
    f.env.N8N_SEND_ENABLED = "false";
    expect(
      await (await f.publicRequest("/api/v1/dispatch/claim", fake)).json(),
    ).toEqual({ authorized: false, dry_run: true });
    expect(
      (await f.publicRequest("/api/v1/requests", validRequest())).status,
    ).toBe(503);
    f.env.N8N_SEND_ENABLED = "true";
  });
  it("crea un ejemplo claramente simulado y soporta dominios largos", async () => {
    const report = await runPageSpeed("audit-example.com", f.env, async () =>
      Response.json(lighthouse),
    );
    report.website = `https://${"a".repeat(60)}.${"b".repeat(60)}.com/`;
    const bytes = await diagnosisPdf(report, true);
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getTitle()).toContain("Diagnóstico");
    await mkdir("test-results", { recursive: true });
    await writeFile("test-results/diagnostico-ejemplo.pdf", bytes);
  });
});
