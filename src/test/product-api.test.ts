// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("../../server/web-express/email-core", () => ({ sendBriefEmails: vi.fn(), sendQuotationEmails: vi.fn() }));
vi.mock("../../server/web-express/capi-core", () => ({ sendMetaEvent: vi.fn() }));
vi.mock("../../server/web-express/wompi-webhook", () => ({ handleWompiWebhook: vi.fn() }));
import { handleProductRequest } from "../../server/web-express/handler";
import { sendBriefEmails, sendQuotationEmails } from "../../server/web-express/email-core";
import { sendMetaEvent } from "../../server/web-express/capi-core";
import { handleWompiWebhook } from "../../server/web-express/wompi-webhook";

const brief = { nombre: "Prueba local", whatsapp: "3000000000", email: "prueba@example.invalid", empresa: "Empresa de prueba", ciudad: "Bogotá", sector: "Servicios", descripcion: "Descripción", servicios: "Servicios", tieneLogo: "si", tieneFotos: "no", secciones: ["Inicio"] };
function post(action: string, data: unknown, origin = "https://www.roicas.com") {
  return new Request(`https://www.roicas.com/api/web-express?action=${action}`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(data) });
}
beforeEach(() => vi.clearAllMocks());
describe("API integrada de Web Express", () => {
  it("conserva el brief y su confirmación sin enviar correos reales", async () => {
    vi.mocked(sendBriefEmails).mockResolvedValue({ ok: true, notified: true, confirmed: true });
    const result = await handleProductRequest(post("brief", brief));
    expect(result.status).toBe(200);
    expect(await result.json()).toMatchObject({ ok: true, confirmed: true });
    expect(sendBriefEmails).toHaveBeenCalledWith(brief);
  });
  it("rechaza los briefs incompletos antes de contactar proveedores", async () => {
    expect((await handleProductRequest(post("brief", { nombre: "x" }))).status).toBe(400);
    expect(sendBriefEmails).not.toHaveBeenCalled();
  });
  it("rechaza formularios de otro origen", async () => {
    expect((await handleProductRequest(post("brief", brief, "https://otro.invalid"))).status).toBe(403);
    expect(sendBriefEmails).not.toHaveBeenCalled();
  });
  it("conserva cotización por correo y consentimiento", async () => {
    vi.mocked(sendQuotationEmails).mockResolvedValue({ status: "sent", confirmed: true });
    const data = { nombre: "Prueba", email: "prueba@example.invalid", negocio: "Local", mensaje: "Necesito una página de prueba", consent: true, website: "" };
    expect((await handleProductRequest(post("quotation", data))).status).toBe(200);
    expect(sendQuotationEmails).toHaveBeenCalledWith(data);
    expect((await handleProductRequest(post("quotation", { ...data, consent: false }))).status).toBe(400);
  });
  it("no admite compras declaradas por el navegador", async () => {
    expect((await handleProductRequest(post("capi", { eventName: "Purchase", eventId: "fake", eventSourceUrl: "https://www.roicas.com/web-express" }))).status).toBe(400);
    expect(sendMetaEvent).not.toHaveBeenCalled();
  });
  it("delega Wompi al verificador de firma original", async () => {
    vi.mocked(handleWompiWebhook).mockResolvedValue(Response.json({ error: "invalid_signature" }, { status: 401 }));
    expect((await handleProductRequest(post("wompi", {}))).status).toBe(401);
    expect(handleWompiWebhook).toHaveBeenCalledOnce();
  });
  it("consulta la hora del servidor sin caché", async () => {
    const result = await handleProductRequest(new Request("https://www.roicas.com/api/web-express?action=clock"));
    expect(result.status).toBe(200);
    expect(result.headers.get("Cache-Control")).toBe("no-store");
    expect((await result.json()).serverNow).toBeGreaterThan(0);
  });
  it("limita el tamaño de los formularios", async () => {
    expect((await handleProductRequest(post("brief", { ...brief, notas: "x".repeat(40000) }))).status).toBe(413);
    expect(sendBriefEmails).not.toHaveBeenCalled();
  });
});
