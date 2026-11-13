import { z } from "zod";
import type { Env } from "./env";
import { base64, decrypt, hmac } from "./crypto";
import { HttpError, json, readJson } from "./http";

export const N8N_WEBHOOK =
  "https://n8n.srv1162733.hstgr.cloud/webhook/wpdoctor-delivery-v1";
export function n8nDeliveryConfigured(env: Env): boolean {
  return !!(
    env.PAGESPEED_API_KEY &&
    env.N8N_DISPATCH_WEBHOOK_URL === N8N_WEBHOOK &&
    env.N8N_SEND_ENABLED === "true" &&
    env.DIAGNOSTIC_DELIVERY_ENABLED === "true" &&
    /^[a-z0-9_]{1,512}$/.test(env.N8N_DOCUMENT_TEMPLATE_NAME ?? "") &&
    /^[a-z]{2}(?:_[A-Z]{2})?$/.test(env.N8N_TEMPLATE_LANGUAGE ?? "")
  );
}
const input = z
  .object({
    delivery_id: z.string().regex(/^[a-f0-9-]{36}:whatsapp$/),
    token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  })
  .strict();
export async function claimN8nDispatch(
  request: Request,
  env: Env,
): Promise<Response> {
  const parsed = input.safeParse(await readJson(request));
  if (!parsed.success)
    throw new HttpError(422, "invalid_dispatch", "Solicitud no válida.");
  if (
    env.ENVIRONMENT === "preview" ||
    env.PUBLIC_DIAGNOSIS_ENABLED !== "true" ||
    env.DIAGNOSTIC_DELIVERY_ENABLED !== "true" ||
    !n8nDeliveryConfigured(env) ||
    env.DELIVERY_MODE !== "n8n_pdf_whatsapp"
  )
    return json({ authorized: false, dry_run: true }, 200);
  const now = Math.floor(Date.now() / 1000),
    { delivery_id, token } = parsed.data;
  const hash = await hmac(env.HASH_SECRET, `dispatch:${delivery_id}:${token}`);
  const delivery = await env.DB.prepare(
    "UPDATE report_deliveries SET dispatch_claimed_at=? WHERE id=? AND channel='whatsapp' AND status='sending' AND lease_until>? AND dispatch_token_hash=? AND dispatch_claimed_at IS NULL AND EXISTS(SELECT 1 FROM diagnosis_jobs j JOIN leads l ON l.id=j.id WHERE j.id=report_deliveries.diagnosis_id AND j.status='ready' AND j.expires_at>? AND l.commercial_status NOT IN ('spam','solicita_no_contacto')) RETURNING diagnosis_id",
  )
    .bind(now, delivery_id, now, hash, now)
    .first<{ diagnosis_id: string }>();
  if (!delivery)
    throw new HttpError(
      409,
      "dispatch_unavailable",
      "Envío no disponible o ya reclamado.",
    );
  const row = await env.DB.prepare(
    "SELECT j.access_encrypted,l.phone_encrypted,l.website_url FROM diagnosis_jobs j JOIN leads l ON l.id=j.id WHERE j.id=? AND j.expires_at>? AND l.commercial_status NOT IN ('spam','solicita_no_contacto')",
  )
    .bind(delivery.diagnosis_id, now)
    .first<{
      access_encrypted: string;
      phone_encrypted: string;
      website_url: string;
    }>();
  if (!row)
    throw new HttpError(409, "dispatch_unavailable", "Envío no disponible.");
  const id = delivery.diagnosis_id;
  const [access, phone] = await Promise.all([
    decrypt(
      env.DATA_ENCRYPTION_KEY,
      row.access_encrypted,
      `${id}:report-token`,
    ),
    decrypt(env.DATA_ENCRYPTION_KEY, row.phone_encrypted, `${id}:phone`),
  ]);
  const pdfUrl = new URL(`/informe/${access}.pdf`, env.APP_BASE_URL).href;
  return json({
    authorized: true,
    dry_run: false,
    delivery_id,
    business_phone_number_id: "1007628075756742",
    payload: {
      messaging_product: "whatsapp",
      to: phone.replace(/^\+/, ""),
      type: "template",
      template: {
        name: env.N8N_DOCUMENT_TEMPLATE_NAME,
        language: { code: env.N8N_TEMPLATE_LANGUAGE },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: {
                  link: pdfUrl,
                  filename: "Diagnostico-WP Doctor.pdf",
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: new URL(row.website_url).hostname },
            ],
          },
        ],
      },
    },
  });
}
export async function sendN8nDispatch(
  env: Env,
  deliveryId: string,
  lease: string,
  upstream: typeof fetch,
): Promise<string> {
  if (!n8nDeliveryConfigured(env)) throw new Error("n8n_not_configured");
  const token = base64(crypto.getRandomValues(new Uint8Array(32)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  const result = await env.DB.prepare(
    "UPDATE report_deliveries SET dispatch_token_hash=?,dispatch_claimed_at=NULL WHERE id=? AND status='sending' AND lease_token=?",
  )
    .bind(
      await hmac(env.HASH_SECRET, `dispatch:${deliveryId}:${token}`),
      deliveryId,
      lease,
    )
    .run();
  if (result.meta.changes !== 1) throw new Error("dispatch_lease_lost");
  const response = await upstream(N8N_WEBHOOK, {
    method: "POST",
    redirect: "manual",
    signal: AbortSignal.timeout(45000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delivery_id: deliveryId, token, dry_run: false }),
  });
  if (!response.ok) throw new Error("n8n_dispatch_failed");
  const raw = await response.text();
  if (raw.length > 8192) throw new Error("n8n_invalid_response");
  const parsed = z
    .object({
      accepted: z.literal(true),
      provider_id: z.string().min(1).max(200),
    })
    .safeParse(JSON.parse(raw));
  if (!parsed.success) throw new Error("n8n_not_accepted");
  return parsed.data.provider_id;
}
