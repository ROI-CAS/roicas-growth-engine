import { z } from "zod";
import { quotationSchema } from "../../src/modules/web-express/lib/quotation";
import { verifiedCampaignCheckout } from "../../src/modules/web-express/lib/campaign";
import { sendBriefEmails, sendQuotationEmails } from "./email-core";
import { sendMetaEvent } from "./capi-core";
import { handleWompiWebhook } from "./wompi-webhook";
import type { BriefData } from "../../src/modules/web-express/lib/brief";
import type { CapiPayload } from "../../src/modules/web-express/lib/capi";

const briefSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  whatsapp: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254),
  empresa: z.string().trim().min(1).max(150),
  ciudad: z.string().max(150), sector: z.string().max(150),
  descripcion: z.string().max(5000), servicios: z.string().max(5000),
  tieneLogo: z.enum(["si", "no", "baja"]), tieneFotos: z.enum(["si", "no"]),
  secciones: z.array(z.string().max(100)).max(20),
  instagram: z.string().max(500).optional(), facebook: z.string().max(500).optional(),
  referencia: z.string().max(1000).optional(), notas: z.string().max(5000).optional(),
});
const capiSchema = z.object({
  eventName: z.enum(["ViewContent", "Lead", "CompleteRegistration", "Contact", "InitiateCheckout"]),
  eventId: z.string().min(1).max(200), eventSourceUrl: z.string().url().max(2000),
  userAgent: z.string().max(1000).optional(), fbp: z.string().max(200).optional(),
  fbc: z.string().max(200).optional(), phone: z.string().max(40).optional(),
  value: z.number().finite().nonnegative().optional(), currency: z.literal("COP").optional(),
});
const json = (data: unknown, status = 200) => Response.json(data, {
  status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
});

async function readPayload(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) break;
    size += result.value.byteLength;
    if (size > 32768) { await reader.cancel(); throw new RangeError("payload_too_large"); }
    chunks.push(result.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}

export async function handleProductRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  if (action === "clock") {
    if (request.method !== "GET") return json({ error: "method_not_allowed" }, 405);
    return json({ serverNow: Date.now(), checkoutUrl: verifiedCampaignCheckout(process.env.WOMPI_BLACK_NOVEMBER_CHECKOUT_URL) });
  }
  if (!["brief", "quotation", "capi", "wompi"].includes(action ?? "")) return json({ error: "not_found" }, 404);
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  // Wompi authenticates its machine-to-machine request with its original signature.
  if (action === "wompi") return handleWompiWebhook(request);
  if (request.headers.get("origin") !== url.origin) return json({ error: "origin_not_allowed" }, 403);
  try {
    const payload = await readPayload(request);
    if (action === "brief") return json(await sendBriefEmails(briefSchema.parse(payload) as BriefData));
    if (action === "quotation") return json(await sendQuotationEmails(quotationSchema.parse(payload)));
    const event = capiSchema.parse(payload) as CapiPayload;
    if (new URL(event.eventSourceUrl).origin !== url.origin) return json({ error: "origin_not_allowed" }, 403);
    return json(await sendMetaEvent({ ...event, pixelId: process.env.VITE_META_PIXEL_ID || "1945796449447211", actionSource: "website" }));
  } catch (error) {
    if (error instanceof RangeError) return json({ error: "payload_too_large" }, 413);
    if (error instanceof z.ZodError || error instanceof SyntaxError) return json({ error: "invalid_payload" }, 400);
    return json({ error: "service_unavailable" }, 503);
  }
}
