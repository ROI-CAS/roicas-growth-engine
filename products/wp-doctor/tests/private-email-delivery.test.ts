import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fixture, validRequest } from "./helpers";
import { createHandler } from "../packages/core/service";
import { decrypt } from "../packages/core/crypto";

describe("Entrega privada por correo y cupo gratuito", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  beforeAll(async () => {
    f = await fixture();
    Object.assign(f.env, {
      PUBLIC_DIAGNOSIS_ENABLED: "true",
      DIAGNOSIS_ENGINE: "pagespeed",
      DIAGNOSTIC_DELIVERY_ENABLED: "true",
      DELIVERY_MODE: "resend_email",
      PAGESPEED_API_KEY: "fixture",
      RESEND_API_KEY: "fixture",
      EMAIL_FROM: "wpdoctor@example.com",
    });
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  const submission = (email: string) =>
    validRequest({
      website_url: `https://site-${crypto.randomUUID().slice(0, 8)}.com`,
      contact: { email },
    });
  it("dos solicitudes concurrentes ocupan dos cupos; reintentar no duplica y la tercera no crea registros", async () => {
    const first = submission("quota@example.com");
    expect((await f.publicRequest("/api/v1/requests", first)).status).toBe(202);
    const responses = await Promise.all([
      f.publicRequest("/api/v1/requests", submission("QUOTA@example.com")),
      f.publicRequest("/api/v1/requests", submission("quota@example.com")),
    ]);
    expect(responses.map((r) => r.status).sort()).toEqual([202, 429]);
    const retry = await f.publicRequest("/api/v1/requests", first);
    expect(retry.status).toBe(202);
    const blocked = await f.publicRequest(
      "/api/v1/requests",
      submission("quota@example.com"),
    );
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toMatchObject({
      error: "email_diagnosis_limit",
    });
    const rows = await f.db
      .prepare("SELECT diagnosis_email_hash FROM leads")
      .all();
    expect(rows.results).toHaveLength(2);
    expect(JSON.stringify(rows.results)).not.toContain("quota@");
    await f.db
      .prepare(
        "UPDATE diagnosis_jobs SET status='failed' WHERE id=(SELECT id FROM leads LIMIT 1)",
      )
      .run();
    expect(
      (
        await f.publicRequest(
          "/api/v1/requests",
          submission("quota@example.com"),
        )
      ).status,
    ).toBe(202);
  });
  it("un análisis de hace más de 30 días libera su cupo", async () => {
    const oldDate = new Date(Date.now() - 31 * 86400000).toISOString();
    await f.db.prepare("UPDATE leads SET created_at=?").bind(oldDate).run();
    expect(
      (
        await f.publicRequest(
          "/api/v1/requests",
          submission("quota@example.com"),
        )
      ).status,
    ).toBe(202);
  });
  it("el seguimiento no revela ni permite reconstruir el enlace enviado al correo", async () => {
    const request = submission("private@example.com");
    const accepted = await f.publicRequest("/api/v1/requests", request);
    const data = (await accepted.json()) as {
      diagnosis_id: string;
      progress_token: string;
      whatsapp_url: string;
    };
    expect(decodeURIComponent(data.whatsapp_url)).toContain(
      "referencia es WP-",
    );
    expect(decodeURIComponent(data.whatsapp_url)).not.toContain(
      data.diagnosis_id,
    );
    const row = await f.db
      .prepare("SELECT access_encrypted FROM diagnosis_jobs WHERE id=?")
      .bind(data.diagnosis_id)
      .first<{ access_encrypted: string }>();
    const reportToken = await decrypt(
      f.env.DATA_ENCRYPTION_KEY,
      row!.access_encrypted,
      `${data.diagnosis_id}:report-token`,
    );
    expect(data.progress_token).not.toBe(reportToken);
    const handler = createHandler("public", {
      fetch: async () =>
        Response.json({
          lighthouseResult: {
            requestedUrl: request.website_url,
            finalUrl: request.website_url,
            fetchTime: new Date().toISOString(),
            categories: { performance: { score: 0.6 } },
            audits: {},
          },
        }),
    });
    const progress = (token: string) =>
      handler(
        new Request(f.env.APP_BASE_URL + "/api/v1/diagnosis/start", {
          method: "POST",
          headers: {
            Origin: f.env.APP_BASE_URL,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: data.diagnosis_id, token }),
        }),
        f.env,
      );
    const ready = await progress(data.progress_token);
    const body = await ready.json();
    expect(body).toMatchObject({
      status: "ready",
      report_url: null,
      delivery_channel: "email",
    });
    expect(JSON.stringify(body)).not.toContain(reportToken);
    expect((await progress(reportToken)).status).toBe(404);
    expect(
      (await f.publicRequest(`/informe/${data.progress_token}.pdf`)).status,
    ).toBe(404);
    expect(
      (await f.publicRequest(`/informe/${reportToken}.pdf`)).headers.get(
        "Content-Type",
      ),
    ).toBe("application/pdf");
  });
});
