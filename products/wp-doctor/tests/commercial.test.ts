import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { fixture, validRequest } from "./helpers";
import { normalizeWebsite } from "../packages/contracts";
import { encrypt, decrypt } from "../packages/core/crypto";

describe("Dominio y protección de datos", () => {
  it.each([
    "http://127.0.0.1",
    "http://2130706433",
    "https://[::1]",
    "https://usuario:clave@empresa.com",
    "file:///etc/passwd",
    "localhost",
    "app.internal",
    "https://empresa.com:443/",
    "https://empresa.com/#token",
  ])("rechaza destino %s", (value) =>
    expect(() => normalizeWebsite(value)).toThrow(),
  );
  it("normaliza solo homepage sin navegar ni conservar query", () =>
    expect(normalizeWebsite("https://EMPRESA.com/ruta?token=secreto")).toBe(
      "https://empresa.com/",
    ));
  it("cifra con aleatoriedad y vincula ciphertext al registro/campo", async () => {
    const key = btoa("01234567890123456789012345678901");
    const a = await encrypt(key, "persona@gmail.com", "a:email");
    const b = await encrypt(key, "persona@gmail.com", "a:email");
    expect(a).not.toBe(b);
    expect(a).not.toContain("gmail");
    expect(await decrypt(key, a, "a:email")).toBe("persona@gmail.com");
    await expect(decrypt(key, a, "b:email")).rejects.toThrow();
  });
});

describe("Etapa comercial con D1 real emulado y Access firmado", () => {
  let f: Awaited<ReturnType<typeof fixture>>;
  let leadId: string;
  beforeAll(async () => {
    f = await fixture();
  });
  afterAll(async () => {
    await f?.mf.dispose();
  });

  it("acepta Gmail, cifra contactos y registra consentimiento sin crear job", async () => {
    const response = await f.publicRequest("/api/v1/requests", validRequest());
    expect(response.status).toBe(202);
    const data = (await response.json()) as {
      request_id: string;
      diagnosis_id: null;
      dispatch_status: string;
      whatsapp_url: string;
    };
    leadId = data.request_id;
    expect(data.diagnosis_id).toBeNull();
    expect(data.dispatch_status).toBe("not_scheduled");
    expect(data.whatsapp_url).toContain("https://wa.me/");
    const row = await f.db
      .prepare("SELECT * FROM leads WHERE id=?")
      .bind(leadId)
      .first();
    expect(row?.website_url).toBe("https://empresa.com/");
    expect(row?.email_encrypted).not.toContain("gmail");
    expect(row?.marketing_opt_in).toBe(0);
    const consent = await f.db
      .prepare("SELECT * FROM lead_consents WHERE lead_id=?")
      .bind(leadId)
      .first();
    expect(consent?.privacy_version).toBeTruthy();
    const events = JSON.stringify(
      (await f.db.prepare("SELECT * FROM funnel_events").all()).results,
    );
    expect(events).not.toContain("gmail");
    expect(events).not.toContain("+573");
    expect(events).not.toContain("test-valid");
  });
  it("reintento con token consumido conserva lead; misma clave con otro contenido da 409", async () => {
    const payload = validRequest({ website_url: "otrodominio.com" });
    const first = await f.publicRequest("/api/v1/requests", payload);
    const a = await first.json();
    const before = f.verifications();
    const second = await f.publicRequest("/api/v1/requests", {
      ...payload,
      turnstile_token: "already-consumed",
    });
    expect(second.status).toBe(202);
    expect(await second.json()).toEqual(a);
    expect(f.verifications()).toBe(before);
    expect(
      (
        await f.publicRequest("/api/v1/requests", {
          ...payload,
          issue_type: "lentitud",
        })
      ).status,
    ).toBe(409);
  });
  it("dos envíos simultáneos no duplican lead ni consentimientos", async () => {
    const payload = validRequest({ website_url: "concurrencia.com" });
    const results = await Promise.all([
      f.publicRequest("/api/v1/requests", payload),
      f.publicRequest("/api/v1/requests", payload),
    ]);
    const values = (await Promise.all(results.map((r) => r.json()))) as {
      request_id: string;
    }[];
    expect(results.every((r) => r.status === 202)).toBe(true);
    expect(values[0]?.request_id).toBe(values[1]?.request_id);
  });
  it.each([
    { privacy_accepted: false },
    { authorization_confirmed: false },
    { turnstile_token: "bad" },
    { company: "spam" },
    { contact: { email: "not-email", whatsapp_phone: "+573001234567" } },
    { contact: { email: "valid@outlook.com", whatsapp_phone: "123" } },
    { privacy_policy_version: "fake" },
    { website_url: "http://localhost" },
  ])(
    "rechaza campos, consentimiento o verificación inválidos %j",
    async (override) => {
      const before = (await f.db
        .prepare("SELECT COUNT(*) AS n FROM leads")
        .first<{ n: number }>())!.n;
      expect(
        (await f.publicRequest("/api/v1/requests", validRequest(override)))
          .status,
      ).toBe(422);
      expect(
        (await f.db
          .prepare("SELECT COUNT(*) AS n FROM leads")
          .first<{ n: number }>())!.n,
      ).toBe(before);
    },
  );
  it("acepta Outlook y teléfono internacional, sin acreditar propiedad", async () => {
    expect(
      (
        await f.publicRequest(
          "/api/v1/requests",
          validRequest({
            website_url: "internacional.com",
            contact: {
              email: "agencia@outlook.com",
              whatsapp_phone: "+12025550123",
            },
          }),
        )
      ).status,
    ).toBe(202);
  });
  it("rechaza CSRF, JSON grande y un flag de diagnóstico activado", async () => {
    expect(
      (
        await f.publicRequest("/api/v1/requests", validRequest(), {
          Origin: "https://evil.com",
        })
      ).status,
    ).toBe(403);
    expect(
      (await f.publicRequest("/api/v1/requests", { text: "x".repeat(17000) }))
        .status,
    ).toBe(413);
    f.env.PUBLIC_DIAGNOSIS_ENABLED = "true";
    expect(
      (await f.publicRequest("/api/v1/requests", validRequest())).status,
    ).toBe(503);
    f.env.PUBLIC_DIAGNOSIS_ENABLED = "false";
  });
  it("producción no acepta configuración legal incompleta", async () => {
    f.env.ENVIRONMENT = "production";
    expect(
      (await f.publicRequest("/api/v1/requests", validRequest())).status,
    ).toBe(503);
    f.env.ENVIRONMENT = "test";
  });
  it("preview permanece cerrado aunque existan claves de otro entorno", async () => {
    f.env.ENVIRONMENT = "preview";
    try {
      const config = await f.publicRequest("/api/v1/public/config");
      expect(((await config.json()) as { enabled: boolean }).enabled).toBe(
        false,
      );
      expect(
        (await f.publicRequest("/api/v1/requests", validRequest())).status,
      ).toBe(503);
    } finally {
      f.env.ENVIRONMENT = "test";
    }
  });
  it("permite captación comercial sin motor ni mensajería una vez configurados los requisitos de producción", async () => {
    const local = await fixture();
    try {
      Object.assign(local.env, {
        ENVIRONMENT: "production",
        LEGAL_APPROVED: "true",
        BUSINESS_NAME: "Fixture comercial",
        PRIVACY_CONTACT: "privacy@example.com",
        PUBLIC_DIAGNOSIS_ENABLED: "false",
      });
      const response = await local.publicRequest(
        "/api/v1/requests",
        validRequest(),
      );
      expect(response.status).toBe(202);
      expect(await response.json()).toMatchObject({
        diagnosis_id: null,
        dispatch_status: "not_scheduled",
      });
      expect(
        (
          await local.db
            .prepare("SELECT COUNT(*) n FROM leads")
            .first<{ n: number }>()
        )?.n,
      ).toBe(1);
      expect(
        (
          await local.db
            .prepare("SELECT COUNT(*) n FROM diagnosis_jobs")
            .first<{ n: number }>()
        )?.n,
      ).toBe(0);
    } finally {
      await local.mf.dispose();
    }
  });
  it("público no expone admin; admin exige token firmado y rol", async () => {
    expect((await f.publicRequest("/api/v1/admin/leads")).status).toBe(404);
    expect(
      (await f.adminRequest("/api/v1/admin/leads", "GET", undefined, null))
        .status,
    ).toBe(401);
    expect(
      (await f.adminRequest("/assets/admin/client.js", "GET", undefined, null))
        .status,
    ).toBe(401);
    expect(
      (
        await f.adminRequest(
          "/api/v1/admin/leads",
          "GET",
          undefined,
          "fake-token",
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await f.adminRequest(
          "/api/v1/admin/leads",
          "GET",
          undefined,
          await f.sign("owner@example.com", "wrong-audience"),
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await f.adminRequest(
          "/api/v1/admin/leads",
          "GET",
          undefined,
          await f.sign("owner@example.com", "test-audience", "-1h"),
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await f.adminRequest(
          "/api/v1/admin/leads",
          "GET",
          undefined,
          await f.sign("tech@example.com"),
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await f.adminRequest(
          "/api/v1/admin/leads",
          "GET",
          undefined,
          await f.sign("intruso@example.com"),
        )
      ).status,
    ).toBe(403);
  });
  it("owner descifra ficha, guarda nota y rechaza versión obsoleta", async () => {
    const detail = await f.adminRequest(`/api/v1/admin/leads/${leadId}`);
    expect(detail.status).toBe(200);
    const data = (await detail.json()) as {
      lead: { email: string; version: number };
    };
    expect(data.lead.email).toBe("cliente@gmail.com");
    const patch = {
      commercial_status: "calificado",
      note: "<script>alert(1)</script>",
      next_action: "Preparar propuesta",
      expected_version: data.lead.version,
    };
    expect(
      (await f.adminRequest(`/api/v1/admin/leads/${leadId}`, "PATCH", patch))
        .status,
    ).toBe(200);
    expect(
      (await f.adminRequest(`/api/v1/admin/leads/${leadId}`, "PATCH", patch))
        .status,
    ).toBe(409);
    const updated = (await (
      await f.adminRequest(`/api/v1/admin/leads/${leadId}`)
    ).json()) as { lead: { next_action: string }; notes: unknown[] };
    expect(updated.lead.next_action).toBe("Preparar propuesta");
    expect(updated.notes).toHaveLength(1);
    expect(
      (
        await f.db
          .prepare(
            "SELECT note_encrypted FROM commercial_notes WHERE lead_id=?",
          )
          .bind(leadId)
          .first<{ note_encrypted: string }>()
      )?.note_encrypted,
    ).not.toContain("script");
  });
  it("oferta humana idempotente; no implica envío automático ni cobro", async () => {
    const payload = {
      idempotency_key: crypto.randomUUID(),
      service_type: "reparacion",
      scope_summary: "Corregir el error delimitado del menú móvil.",
      exclusions: "No incluye rediseño ni licencias.",
      quoted_price_cop: 189000,
      status: "enviada",
    };
    const first = await f.adminRequest(
      `/api/v1/admin/leads/${leadId}/offers`,
      "POST",
      payload,
    );
    const second = await f.adminRequest(
      `/api/v1/admin/leads/${leadId}/offers`,
      "POST",
      payload,
    );
    expect(first.status).toBe(201);
    expect(await first.json()).toEqual(await second.json());
    const count = await f.db
      .prepare("SELECT COUNT(*) AS n FROM commercial_offers WHERE lead_id=?")
      .bind(leadId)
      .first<{ n: number }>();
    expect(count?.n).toBe(1);
    const row = await f.db
      .prepare("SELECT commercial_status FROM leads WHERE id=?")
      .bind(leadId)
      .first();
    expect(row?.commercial_status).toBe("propuesta_enviada");
  });
  it("respeta no contacto y bloquea mutaciones desde otro origen", async () => {
    const row = await f.db
      .prepare("SELECT version FROM leads WHERE id=?")
      .bind(leadId)
      .first<{ version: number }>();
    expect(
      (
        await f.adminRequest(`/api/v1/admin/leads/${leadId}`, "PATCH", {
          commercial_status: "solicita_no_contacto",
          note: "Solicitado por el usuario",
          next_action: "",
          expected_version: row!.version,
        })
      ).status,
    ).toBe(200);
    expect(
      (
        await f.adminRequest(`/api/v1/admin/leads/${leadId}/offers`, "POST", {
          idempotency_key: crypto.randomUUID(),
          service_type: "reparacion",
          scope_summary: "No debe poder enviarse.",
          exclusions: "Ninguna",
          quoted_price_cop: 189000,
          status: "borrador",
        })
      ).status,
    ).toBe(409);
    expect(
      (
        await f.adminRequest(
          `/api/v1/admin/leads/${leadId}`,
          "PATCH",
          {},
          f.token,
          { Origin: "https://evil.com" },
        )
      ).status,
    ).toBe(403);
  });
  it("mantiene cabeceras, sin secretos ni logs técnicos en páginas públicas", async () => {
    const response = await f.publicRequest("/");
    expect(response.headers.get("Content-Security-Policy")).toContain(
      "frame-ancestors 'none'",
    );
    const html = await response.text();
    expect(html).toContain("189.000");
    expect(html).not.toContain(f.env.TURNSTILE_SECRET);
    expect(html).not.toContain(f.env.DATA_ENCRYPTION_KEY);
  });
  it("eventos anónimos requieren consentimiento y rechazan PII o campos extra", async () => {
    expect(
      (
        await f.publicRequest("/api/v1/funnel-events", {
          event_name: "landing_view",
          analytics_consent: false,
        })
      ).status,
    ).toBe(422);
    expect(
      (
        await f.publicRequest("/api/v1/funnel-events", {
          event_name: "landing_view",
          analytics_consent: true,
          email: "privado@gmail.com",
        })
      ).status,
    ).toBe(422);
    expect(
      (
        await f.publicRequest("/api/v1/funnel-events", {
          event_name: "landing_view",
          analytics_consent: true,
        })
      ).status,
    ).toBe(202);
    const row = await f.db
      .prepare("SELECT * FROM funnel_events WHERE event_name='landing_view'")
      .first();
    expect(row?.lead_id).toBeNull();
    expect(JSON.stringify(row)).not.toContain("gmail");
  });
  it("límite por dominio efectivo en D1", async () => {
    for (let i = 0; i < 6; i++)
      expect(
        (
          await f.publicRequest(
            "/api/v1/requests",
            validRequest({ website_url: "limite.com" }),
            { "CF-Connecting-IP": `203.0.113.${i}` },
          )
        ).status,
      ).toBe(202);
    expect(
      (
        await f.publicRequest(
          "/api/v1/requests",
          validRequest({ website_url: "limite.com" }),
          { "CF-Connecting-IP": "203.0.113.30" },
        )
      ).status,
    ).toBe(429);
  });
});
