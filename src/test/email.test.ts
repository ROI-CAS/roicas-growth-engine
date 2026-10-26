// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../api/send-email.js";
import { sendEmailSubmission } from "@/lib/emailSubmission";

const contact = {
  kind: "contact", requestId: "b9d30c5d-facc-45c0-91dd-5f26123cf355",
  name: "Prueba", phone: "+573114565403", company: "ROICAS", privacyConsent: true, source: "/contacto",
};
const brief = {
  kind: "brief",
  lead: {
    lead_id: "ROI-EC-TEST", business: { business_name: "Tienda" },
    contact: { contact_name: "Cliente", contact_email: "cliente@example.com", full_whatsapp: "+573114565403" },
    consent: { accepted: true }, summary_text: "Cotización completa <script>alert(1)</script>",
  },
};

const response = () => {
  const res = { statusCode: 0, body: null as any, setHeader: vi.fn(), status: vi.fn(), json: vi.fn() };
  res.status.mockImplementation((code) => { res.statusCode = code; return res; });
  res.json.mockImplementation((body) => { res.body = body; return res; });
  return res;
};
const request = (body: unknown) => ({ method: "POST", headers: { origin: "https://www.roicas.com" }, body });

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "test-only-key");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: "email-test-id" }) }));
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("Resend server integration", () => {
  it("uses the fixed recipient and sender, ignoring injected addresses", async () => {
    const res = response();
    await handler(request({ ...contact, to: "other@example.com", from: "other@example.com" }), res);
    expect(res.statusCode).toBe(200);
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(JSON.parse(options.body as string)).toMatchObject({ from: "ROICAS Ventas <ventas@roicas.com>", to: ["herebus_cas@hotmail.com"] });
    expect(res.body).toEqual({ success: true, id: "email-test-id" });
  });
  it("escapes brief content and sets reply-to to the customer", async () => {
    await handler(request(brief), response());
    const email = JSON.parse(vi.mocked(fetch).mock.calls[0][1].body as string);
    expect(email.reply_to).toBe("cliente@example.com");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).not.toContain("<script>");
    expect(email.text).toBe(brief.lead.summary_text);
  });
  it("keeps the same idempotency key when retrying a brief", async () => {
    await handler(request(brief), response());
    await handler(request({ ...brief, lead: { ...brief.lead, internal: { notification_status: "notification_pending" } } }), response());
    const headers = vi.mocked(fetch).mock.calls.map((call) => call[1].headers);
    expect(headers[0]["Idempotency-Key"]).toBe(headers[2]["Idempotency-Key"]);
    expect(headers[1]["Idempotency-Key"]).toBe(headers[3]["Idempotency-Key"]);
  });
  it("sends the branded confirmation only to the validated customer email", async () => {
    const res = response();
    await handler(request(brief), res);
    const confirmation = JSON.parse(vi.mocked(fetch).mock.calls[1][1].body as string);
    expect(confirmation.to).toEqual(["cliente@example.com"]);
    expect(confirmation.reply_to).toBe("ventas@roicas.com");
    expect(confirmation.html).toContain("ROI-EC-TEST");
    expect(confirmation.html).toContain("https://wa.me/573114565403");
    expect(confirmation.html).not.toContain(brief.lead.summary_text);
    expect(res.body.confirmationId).toBe("email-test-id");
  });
  it("does not claim confirmation when only the internal email was accepted", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ id: "internal-id" }) } as Response)
      .mockResolvedValueOnce({ ok: false, status: 429, json: async () => ({ name: "rate_limit_exceeded" }) } as Response);
    const res = response();
    await handler(request(brief), res);
    expect(res.statusCode).toBe(502);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("Recibimos tu solicitud");
  });
  it("fails when the server secret is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = response();
    await handler(request(contact), res);
    expect(res.statusCode).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("does not claim success when Resend rejects the request", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 403, json: async () => ({ name: "validation_error" }) } as Response);
    const res = response();
    await handler(request(contact), res);
    expect(res.statusCode).toBe(502);
    expect(res.body.success).toBe(false);
  });
  it("does not claim success without an email ID", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, status: 200, json: async () => ({}) } as Response);
    const res = response();
    await handler(request(contact), res);
    expect(res.statusCode).toBe(502);
  });
  it("rejects missing consent and invalid email before contacting Resend", async () => {
    for (const body of [{ ...contact, privacyConsent: false }, { ...brief, lead: { ...brief.lead, contact: { ...brief.lead.contact, contact_email: "bad" } } }]) {
      const res = response();
      await handler(request(body), res);
      expect(res.statusCode).toBe(400);
    }
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects requests from another website", async () => {
    const res = response();
    await handler({ ...request(contact), headers: { origin: "https://other.example" } }, res);
    expect(res.statusCode).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("handles timeouts without reporting success", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("timeout"));
    const res = response();
    await handler(request(contact), res);
    expect(res.statusCode).toBe(502);
  });
});

describe("Form email confirmation", () => {
  it("rejects an HTML page returned with HTTP 200", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => { throw new Error("HTML"); } } as unknown as Response);
    await expect(sendEmailSubmission(contact)).rejects.toThrow("No pudimos confirmar");
  });
  it("requires both success and an email ID", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ success: true }) } as Response);
    await expect(sendEmailSubmission(contact)).rejects.toThrow();
  });
  it("accepts a confirmed email submission", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ success: true, id: "email-test-id" }) } as Response);
    await expect(sendEmailSubmission(contact)).resolves.toBeUndefined();
  });
});
