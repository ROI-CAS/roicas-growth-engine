import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fixture, validRequest } from "./helpers";
import { createHandler } from "../packages/core/service";

const result = {
  lighthouseResult: {
    requestedUrl: "https://audit-example.com/",
    finalUrl: "https://audit-example.com/",
    fetchTime: "2026-10-16T18:00:00.000Z",
    categories: { performance: { score: 0.42 } },
    audits: {},
  },
};
describe("Progreso privado e inicio inmediato", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  beforeAll(async () => {
    f = await fixture();
    Object.assign(f.env, {
      PUBLIC_DIAGNOSIS_ENABLED: "true",
      DIAGNOSIS_ENGINE: "pagespeed",
      DIAGNOSTIC_DELIVERY_ENABLED: "true",
      PAGESPEED_API_KEY: "fixture",
      BREVO_API_KEY: "fixture",
      EMAIL_FROM: "reportes@example.com",
      WHATSAPP_API_TOKEN: "fixture",
      WHATSAPP_PHONE_NUMBER_ID: "12345678",
      WHATSAPP_API_VERSION: "v25.0",
      WHATSAPP_REPORT_TEMPLATE: "diagnostico_listo",
      WHATSAPP_TEMPLATE_LANGUAGE: "es",
    });
  });
  afterAll(async () => {
    await f.mf.dispose();
  });
  it("inicia solo el job autorizado, conserva idempotencia y permite abrir el PDF sin esperar la mensajería", async () => {
    const unrelated = await f.publicRequest(
      "/api/v1/requests",
      validRequest({ website_url: "other-example.com" }),
    );
    const otherId = ((await unrelated.json()) as { diagnosis_id: string })
      .diagnosis_id;
    const accepted = await f.publicRequest(
      "/api/v1/requests",
      validRequest({ website_url: "audit-example.com" }),
    );
    const data = (await accepted.json()) as {
      diagnosis_id: string;
      progress_token: string;
    };
    expect(data.progress_token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const capability = { id: data.diagnosis_id, token: data.progress_token };
    const calls: string[] = [];
    const handler = createHandler("public", {
      fetch: async (input) => {
        const url = new URL(String(input));
        expect(url.hostname).toBe("www.googleapis.com");
        calls.push(url.searchParams.get("strategy")!);
        return Response.json(result);
      },
    });
    const invoke = (
      path: string,
      body = capability,
      origin = f.env.APP_BASE_URL,
    ) =>
      handler(
        new Request(f.env.APP_BASE_URL + path, {
          method: "POST",
          headers: { Origin: origin, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
        f.env,
      );
    const queued = await invoke("/api/v1/diagnosis/status");
    expect(await queued.json()).toMatchObject({
      status: "queued",
      report_url: null,
    });
    expect(
      (
        await invoke("/api/v1/diagnosis/start", {
          ...capability,
          token: "x".repeat(43),
        })
      ).status,
    ).toBe(404);
    expect(
      (
        await invoke(
          "/api/v1/diagnosis/start",
          capability,
          "https://evil.example",
        )
      ).status,
    ).toBe(403);
    expect(calls).toHaveLength(0);
    const responses = await Promise.all([
      invoke("/api/v1/diagnosis/start"),
      invoke("/api/v1/diagnosis/start"),
    ]);
    expect(responses.every((r) => r.status === 200)).toBe(true);
    expect(calls.sort()).toEqual(["desktop", "mobile"]);
    const ready = await invoke("/api/v1/diagnosis/status");
    const readyData = (await ready.json()) as {
      status: string;
      report_url: string;
    };
    expect(readyData).toMatchObject({
      status: "ready",
      delivery_status: "queued",
      report_url: expect.stringMatching(/^\/informe\/[A-Za-z0-9_-]{43}\.pdf$/),
    });
    expect(readyData.report_url).not.toContain(data.progress_token);
    expect(
      (await f.publicRequest(`/informe/${data.progress_token}.pdf`)).status,
    ).toBe(404);
    expect(JSON.stringify(readyData)).not.toContain("cliente@gmail");
    expect(ready.headers.get("Cache-Control")).toBe("no-store");
    const pdf = await f.publicRequest(readyData.report_url);
    expect(pdf.headers.get("Content-Type")).toBe("application/pdf");
    expect(
      (
        await f.db
          .prepare("SELECT status FROM diagnosis_jobs WHERE id=?")
          .bind(otherId)
          .first<{ status: string }>()
      )?.status,
    ).toBe("queued");
    await invoke("/api/v1/diagnosis/start");
    expect(calls).toHaveLength(2);
    await f.db
      .prepare(
        "UPDATE leads SET commercial_status='solicita_no_contacto' WHERE id=?",
      )
      .bind(capability.id)
      .run();
    expect((await invoke("/api/v1/diagnosis/status")).status).toBe(404);
    await f.db
      .prepare("UPDATE leads SET commercial_status='nuevo' WHERE id=?")
      .bind(capability.id)
      .run();
    await f.db
      .prepare("UPDATE diagnosis_jobs SET expires_at=0 WHERE id=?")
      .bind(capability.id)
      .run();
    expect((await invoke("/api/v1/diagnosis/status")).status).toBe(404);
  });
  it("mantiene cerrados inicio y progreso cuando el diagnóstico está apagado", async () => {
    f.env.PUBLIC_DIAGNOSIS_ENABLED = "false";
    expect(
      (
        await f.publicRequest("/api/v1/diagnosis/start", {
          id: crypto.randomUUID(),
          token: "a".repeat(43),
        })
      ).status,
    ).toBe(503);
  });
});
