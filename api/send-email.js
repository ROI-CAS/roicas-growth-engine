import { createHash } from "node:crypto";
import { z } from "zod";

const shortText = z.string().trim().min(1).max(200);
const phone = z.string().trim().regex(/^\+?[\d\s()-]{7,25}$/);
const submission = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("contact"), requestId: z.string().uuid(), name: shortText, phone,
    company: z.string().trim().max(200), privacyConsent: z.literal(true),
    source: z.string().max(200).startsWith("/"),
  }),
  z.object({
    kind: z.literal("brief"),
    lead: z.object({
      lead_id: shortText,
      business: z.object({ business_name: shortText }),
      contact: z.object({ contact_name: shortText, contact_email: z.string().email().max(254), full_whatsapp: phone }),
      consent: z.object({ accepted: z.literal(true) }),
      summary_text: z.string().trim().min(20).max(50000),
    }),
  }),
]);

const escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Método no permitido." });
  }
  const allowedOrigins = new Set(["https://roicas.com", "https://www.roicas.com"]);
  if (process.env.VERCEL_URL) allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
  if (req.headers.origin && !allowedOrigins.has(req.headers.origin)) {
    return res.status(403).json({ success: false, error: "Origen no permitido." });
  }
  let input;
  try {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (!raw || Buffer.byteLength(raw, "utf8") > 80000) {
      return res.status(413).json({ success: false, error: "Solicitud demasiado grande." });
    }
    input = submission.parse(JSON.parse(raw));
  } catch {
    return res.status(400).json({ success: false, error: "Revisa los datos de la solicitud." });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("email_configuration_missing");
    return res.status(503).json({ success: false, error: "El envío no está disponible. Escríbenos por WhatsApp al +57 311 456 5403." });
  }
  let subject, text, replyTo, requestKey;
  if (input.kind === "brief") {
    const lead = input.lead;
    subject = `[Brief E-commerce] ${lead.business.business_name} — ${lead.contact.contact_name}`;
    text = lead.summary_text;
    replyTo = lead.contact.contact_email;
    requestKey = lead.lead_id;
  } else {
    subject = `[Contacto web] ${input.name}`;
    text = `Nueva solicitud de contacto\n\nNombre: ${input.name}\nWhatsApp: ${input.phone}\nEmpresa: ${input.company || "No indicada"}\nPágina: ${input.source}\nPolítica de privacidad: aceptada`;
    requestKey = input.requestId;
  }
  subject = subject.replace(/[\r\n]/g, " ").slice(0, 250);
  const email = {
    from: "ROICAS Ventas <ventas@roicas.com>", to: ["herebus_cas@hotmail.com"], subject, text,
    html: `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto"><h2>Solicitud desde ROICAS</h2><pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre></div>`,
    ...(replyTo ? { reply_to: replyTo } : {}),
  };
  const digest = createHash("sha256").update(JSON.stringify({ requestKey, email })).digest("hex");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json",
        "Idempotency-Key": `roicas/${input.kind}/${digest}`,
      },
      body: JSON.stringify(email), signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== "string" || !result.id) {
      console.error("email_provider_rejected", { status: response.status, code: result?.name });
      return res.status(502).json({ success: false, error: "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp." });
    }
    return res.status(200).json({ success: true, id: result.id });
  } catch {
    console.error("email_provider_unavailable");
    return res.status(502).json({ success: false, error: "No pudimos confirmar el envío. Inténtalo de nuevo o escríbenos por WhatsApp." });
  }
}
