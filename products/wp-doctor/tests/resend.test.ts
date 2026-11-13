import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fixture, validRequest } from "./helpers";
import {
  processDiagnostics,
  deliveryConfigured,
} from "../packages/core/diagnosis";
import { decrypt } from "../packages/core/crypto";

const lighthouse = {
  lighthouseResult: {
    requestedUrl: "https://audit-example.com/",
    finalUrl: "https://audit-example.com/",
    fetchTime: "2026-10-16T18:00:00.000Z",
    categories: { performance: { score: 0.42 } },
    audits: {},
  },
};
describe("Resend: enlace privado por correo y WhatsApp opcional", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  beforeAll(async () => {
    f = await fixture();
    Object.assign(f.env, {
      DELIVERY_MODE: "resend_email",
      EMAIL_FROM: "wpdoctor@roicas.com",
      RESEND_API_KEY: "fixture-resend",
      PAGESPEED_API_KEY: "fixture-google",
      PUBLIC_DIAGNOSIS_ENABLED: "true",
      DIAGNOSIS_ENGINE: "pagespeed",
      DIAGNOSTIC_DELIVERY_ENABLED: "true",
    });
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  it("acepta correo sin teléfono, cifra el contacto y entrega un enlace sin llamar a WhatsApp ni Brevo", async () => {
    expect(deliveryConfigured(f.env)).toBe(true);
    const response = await f.publicRequest(
      "/api/v1/requests",
      validRequest({
        website_url: "audit-example.com",
        contact: { email: "cliente@gmail.com" },
      }),
    );
    expect(response.status).toBe(202);
    const accepted = (await response.json()) as {
      request_id: string;
      progress_token: string;
    };
    const stored = await f.db
      .prepare("SELECT email_encrypted,phone_encrypted FROM leads WHERE id=?")
      .bind(accepted.request_id)
      .first<{ email_encrypted: string; phone_encrypted: string }>();
    expect(stored!.email_encrypted).not.toContain("cliente@gmail.com");
    expect(
      await decrypt(
        f.env.DATA_ENCRYPTION_KEY,
        stored!.phone_encrypted,
        `${accepted.request_id}:phone`,
      ),
    ).toBe("");
    const emails: { key: string; body: string }[] = [];
    const job = await f.db
      .prepare("SELECT access_encrypted FROM diagnosis_jobs WHERE id=?")
      .bind(accepted.request_id)
      .first<{ access_encrypted: string }>();
    const reportToken = await decrypt(
      f.env.DATA_ENCRYPTION_KEY,
      job!.access_encrypted,
      `${accepted.request_id}:report-token`,
    );
    const upstream: typeof fetch = async (input, init) => {
      const host = new URL(String(input)).hostname;
      if (host === "www.googleapis.com") return Response.json(lighthouse);
      expect(String(input)).toBe("https://api.resend.com/emails");
      expect(init?.redirect).toBe("manual");
      const headers = new Headers(init?.headers);
      expect(headers.get("authorization")).toBe("Bearer fixture-resend");
      const body = JSON.parse(String(init?.body));
      expect(body.from).toBe("WP Doctor · Roicas <wpdoctor@roicas.com>");
      expect(body.to).toEqual(["cliente@gmail.com"]);
      expect(body.attachments).toBeUndefined();
      expect(body.html).toContain(`/informe/${reportToken}.pdf`);
      expect(body.html).not.toContain(accepted.progress_token);
      expect(body.html).not.toContain("fixture-resend");
      expect(body.html).toContain('role="presentation"');
      expect(body.html).toContain('lang="es"');
      expect(body.html).toContain("Rendimiento PC");
      expect(body.html).not.toContain("<script");
      expect(body.text).toBeTruthy();
      emails.push({
        key: headers.get("idempotency-key")!,
        body: String(init?.body),
      });
      return emails.length === 1
        ? new Response(null, { status: 503 })
        : Response.json({ id: "email-resend-fixture" });
    };
    await processDiagnostics(f.env, upstream);
    await f.db
      .prepare(
        "UPDATE report_deliveries SET available_at=0 WHERE diagnosis_id=?",
      )
      .bind(accepted.request_id)
      .run();
    await processDiagnostics(f.env, upstream);
    expect(emails).toHaveLength(2);
    expect(emails[0]).toEqual(emails[1]);
    const deliveries = await f.db
      .prepare(
        "SELECT channel,status FROM report_deliveries WHERE diagnosis_id=?",
      )
      .bind(accepted.request_id)
      .all();
    expect(deliveries.results).toEqual([
      { channel: "email", status: "accepted" },
    ]);
    const progress = await f.publicRequest("/api/v1/diagnosis/status", {
      id: accepted.request_id,
      token: accepted.progress_token,
    });
    expect(await progress.json()).toMatchObject({
      delivery_channel: "email",
      delivery_status: "accepted",
      report_url: null,
    });
    const pdf = await f.publicRequest(`/informe/${reportToken}.pdf`);
    expect(pdf.status).toBe(200);
    expect(pdf.headers.get("Content-Type")).toBe("application/pdf");
  });
  it("requiere correo y configuración de Resend sin exigir las credenciales de WhatsApp", async () => {
    const missing = await f.publicRequest(
      "/api/v1/requests",
      validRequest({ contact: { whatsapp_phone: "+573001234567" } }),
    );
    expect(missing.status).toBe(422);
    expect(deliveryConfigured({ ...f.env, RESEND_API_KEY: undefined })).toBe(
      false,
    );
    expect(deliveryConfigured({ ...f.env, EMAIL_FROM: "invalid" })).toBe(false);
    expect(
      deliveryConfigured({ ...f.env, DIAGNOSTIC_DELIVERY_ENABLED: "false" }),
    ).toBe(false);
  });
});
