import { z } from "zod";
import type { Env } from "./env";
import { base64, decrypt, encrypt } from "./crypto";
import { escapeHtml as e, HttpError, json, readJson, sameOrigin } from "./http";
import { POLICY_VERSION } from "../contracts";

type Order = {
  id: string;
  offer_id: string;
  lead_id: string;
  access_encrypted: string;
  reference: string;
  amount_in_cents: number;
  environment: string;
  status: string;
  transaction_id: string | null;
  accepted_at: string | null;
  expires_at: string;
};
const statuses = [
  "PENDING",
  "APPROVED",
  "DECLINED",
  "VOIDED",
  "ERROR",
] as const;
const txSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z0-9-]{1,100}$/),
    reference: z.string().max(100),
    amount_in_cents: z.number().int().positive(),
    currency: z.literal("COP"),
    status: z.enum(statuses),
  })
  .passthrough();
export async function sha256(value: string): Promise<string> {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
  ]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
function paymentModeAllowed(env: Env): boolean {
  const mode = env.WOMPI_ENVIRONMENT;
  if (mode === "prod" && (env.ENVIRONMENT !== "production" || env.LEGAL_APPROVED !== "true"))
    return false;
  if (
    env.WOMPI_ENABLED !== "true" ||
    !["test", "prod"].includes(mode ?? "") ||
    (env.ENVIRONMENT === "production" && mode !== "prod")
  )
    return false;
  return true;
}
export function paymentsConfigured(env: Env): boolean {
  if (!paymentModeAllowed(env)) return false;
  const mode = env.WOMPI_ENVIRONMENT;
  return (
    !!env.WOMPI_PUBLIC_KEY?.startsWith(`pub_${mode}_`) &&
    !!env.WOMPI_PRIVATE_KEY?.startsWith(`prv_${mode}_`) &&
    !!env.WOMPI_INTEGRITY_SECRET?.startsWith(`${mode}_integrity_`) &&
    !!env.WOMPI_EVENTS_SECRET?.startsWith(`${mode}_events_`)
  );
}
function requirePayments(env: Env) {
  if (!paymentsConfigured(env))
    throw new HttpError(
      503,
      "payments_unavailable",
      "Los pagos todavía no están habilitados.",
    );
}
export async function paymentForOffer(
  env: Env,
  offerId: string,
  actor: string,
): Promise<Response> {
  // The Access-protected admin only creates an order; provider keys stay in the public Worker.
  if (!paymentModeAllowed(env)) throw new HttpError(503,"payments_unavailable","Los pagos todavía no están habilitados.");
  const offer = await env.DB.prepare(
    "SELECT o.id,o.lead_id,o.quoted_price_cop,o.status,l.commercial_status FROM commercial_offers o JOIN leads l ON l.id=o.lead_id WHERE o.id=?",
  )
    .bind(offerId)
    .first<{
      id: string;
      lead_id: string;
      quoted_price_cop: number;
      status: string;
      commercial_status: string;
    }>();
  if (
    !offer ||
    offer.status !== "enviada" ||
    ["spam", "solicita_no_contacto"].includes(offer.commercial_status)
  )
    throw new HttpError(
      409,
      "offer_not_payable",
      "Primero registra y comunica una cotización revisada para esta solicitud.",
    );
  const id = crypto.randomUUID();
  const token = base64(crypto.getRandomValues(new Uint8Array(32)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + 7 * 86400000).toISOString();
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO payment_orders(id,offer_id,lead_id,access_hash,access_encrypted,reference,amount_in_cents,environment,created_at,expires_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(offer_id) DO NOTHING",
    ).bind(
      id,
      offerId,
      offer.lead_id,
      await sha256(token),
      await encrypt(env.DATA_ENCRYPTION_KEY, token, `${offerId}:payment`),
      `WPD-${id}`,
      offer.quoted_price_cop * 100,
      env.WOMPI_ENVIRONMENT!,
      now,
      expires,
      now,
    ),
    env.DB.prepare(
      "INSERT INTO audit_log(id,lead_id,actor_id,action,metadata_json,created_at) SELECT ?,lead_id,?,'payment.created','{}',? FROM payment_orders WHERE id=?",
    ).bind(crypto.randomUUID(), actor, now, id),
  ]);
  const saved = await env.DB.prepare(
    "SELECT * FROM payment_orders WHERE offer_id=?",
  )
    .bind(offerId)
    .first<Order>();
  if (!saved)
    throw new HttpError(
      409,
      "payment_conflict",
      "No se pudo preparar el pago.",
    );
  const access = await decrypt(
    env.DATA_ENCRYPTION_KEY,
    saved.access_encrypted,
    `${offerId}:payment`,
  );
  return json({
    payment_url: `${env.APP_BASE_URL}/pagar/${access}`,
    status: saved.status,
    expires_at: saved.expires_at,
    amount_cop: saved.amount_in_cents / 100,
  });
}
async function orderByToken(env: Env, token: string): Promise<Order> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token))
    throw new HttpError(404, "not_found", "Enlace no disponible.");
  const row = await env.DB.prepare(
    "SELECT p.* FROM payment_orders p JOIN leads l ON l.id=p.lead_id WHERE p.access_hash=? AND l.commercial_status NOT IN ('spam','solicita_no_contacto')",
  )
    .bind(await sha256(token))
    .first<Order>();
  if (
    !row ||
    row.expires_at < new Date().toISOString() ||
    row.environment !== env.WOMPI_ENVIRONMENT
  )
    throw new HttpError(
      404,
      "not_found",
      "Enlace vencido o no disponible. Contacta a WP Doctor.",
    );
  return row;
}
export async function paymentPage(
  request: Request,
  env: Env,
  token: string,
): Promise<Response> {
  requirePayments(env);
  const order = await orderByToken(env, token);
  const offer = await env.DB.prepare(
    "SELECT scope_encrypted,exclusions_encrypted FROM commercial_offers WHERE id=?",
  )
    .bind(order.offer_id)
    .first<{ scope_encrypted: string; exclusions_encrypted: string }>();
  if (!offer)
    throw new HttpError(404, "not_found", "Cotización no disponible.");
  const scope = await decrypt(
    env.DATA_ENCRYPTION_KEY,
    offer.scope_encrypted,
    `${order.lead_id}:scope`,
  );
  const exclusions = await decrypt(
    env.DATA_ENCRYPTION_KEY,
    offer.exclusions_encrypted,
    `${order.lead_id}:exclusions`,
  );
  const amount = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(order.amount_in_cents / 100);
  const approved = order.status === "APPROVED";
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Tu cotización · WP Doctor</title><link rel="stylesheet" href="/assets/style.css"><script type="module" src="/assets/public/payment.js"></script></head><body><header class="header wrap"><a class="brand" href="/">WP Doctor · Roicas</a></header><main id="contenido" class="legal wrap"><p class="eyebrow">COTIZACIÓN PRIVADA${order.environment === "test" ? " · MODO DE PRUEBA, SIN DINERO REAL" : ""}</p><h1>Tu siguiente paso, con todo claro.</h1><p class="price">${e(amount)} <small>COP · Total de esta cotización</small></p><h2>Alcance</h2><p>${e(scope)}</p><h2>Exclusiones</h2><p>${e(exclusions)}</p><p>La reparación se limita al alcance anterior. El diagnóstico preliminar sigue siendo gratuito. Los datos de tarjeta se introducen únicamente en Wompi.</p><p id="payment-status" role="status">${approved ? "Pago confirmado por Wompi. El equipo coordinará contigo el acceso temporal y la intervención." : `Estado: ${e(order.status)}. Volver de Wompi no confirma por sí solo un pago.`}</p>${approved ? "" : `<form id="payment-form" data-token="${e(token)}"><label><input id="payment-accept" type="checkbox" required> He revisado y acepto el alcance, las exclusiones, el precio total y las <a href="/condiciones" target="_blank" rel="noopener">condiciones del servicio</a>.</label><p><button class="button" type="submit">Pagar ${e(amount)} con Wompi ↗</button></p></form>`}<p>Enlace privado válido hasta ${e(order.expires_at.slice(0, 10))}. No lo compartas públicamente.</p><p><a href="mailto:hello@roicas.com">Contactar a WP Doctor</a> · <a href="/privacidad">Privacidad</a></p></main></body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
export async function checkout(request: Request, env: Env): Promise<Response> {
  requirePayments(env);
  sameOrigin(request, env.APP_BASE_URL);
  const originalPayload = await readJson(request);
  const parsed = z
    .object({ token: z.string(), accepted: z.literal(true) })
    .safeParse(originalPayload);
  if (!parsed.success)
    throw new HttpError(
      422,
      "acceptance_required",
      "Acepta el alcance y las condiciones antes de pagar.",
    );
  const order = await orderByToken(env, parsed.data.token);
  if (order.status === "APPROVED" || order.status === "PENDING")
    throw new HttpError(
      409,
      "payment_in_progress",
      "El pago está confirmado o pendiente. Consulta su estado antes de pagar otra vez.",
    );
  const expiration = order.expires_at;
  const integrity = await sha256(
    `${order.reference}${order.amount_in_cents}COP${expiration}${env.WOMPI_INTEGRITY_SECRET}`,
  );
  const url = new URL("https://checkout.wompi.co/p/");
  const params = {
    "public-key": env.WOMPI_PUBLIC_KEY!,
    currency: "COP",
    "amount-in-cents": String(order.amount_in_cents),
    reference: order.reference,
    "signature:integrity": integrity,
    "expiration-time": expiration,
    "redirect-url": `${env.APP_BASE_URL}/pagar/${parsed.data.token}`,
  };
  for (const [key, value] of Object.entries(params))
    url.searchParams.set(key, value);
  await env.DB.prepare(
    "UPDATE payment_orders SET accepted_at=COALESCE(accepted_at,?),terms_version=COALESCE(terms_version,?),updated_at=? WHERE id=?",
  )
    .bind(
      new Date().toISOString(),
      POLICY_VERSION,
      new Date().toISOString(),
      order.id,
    )
    .run();
  return json({ checkout_url: url.href });
}

async function reconcile(
  env: Env,
  id: string,
  upstream: typeof fetch,
): Promise<{ status: string; order: Order }> {
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id))
    throw new HttpError(422, "invalid_transaction", "Transacción no válida.");
  const host =
    env.WOMPI_ENVIRONMENT === "prod"
      ? "production.wompi.co"
      : "sandbox.wompi.co";
  const response = await upstream(
    `https://${host}/v1/transactions/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${env.WOMPI_PRIVATE_KEY}`,
        Accept: "application/json",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(12000),
    },
  );
  if (!response.ok)
    throw new HttpError(
      502,
      "verification_unavailable",
      "No se pudo confirmar con Wompi. Consulta de nuevo más tarde.",
    );
  const envelope = z
    .object({ data: txSchema })
    .safeParse(await response.json());
  if (!envelope.success || envelope.data.data.id !== id)
    throw new HttpError(
      422,
      "invalid_transaction",
      "Respuesta de pago no válida.",
    );
  const tx = envelope.data.data;
  const order = await env.DB.prepare(
    "SELECT * FROM payment_orders WHERE reference=?",
  )
    .bind(tx.reference)
    .first<Order>();
  if (
    !order ||
    order.environment !== env.WOMPI_ENVIRONMENT ||
    order.amount_in_cents !== tx.amount_in_cents ||
    !order.accepted_at ||
    (order.transaction_id && order.transaction_id !== tx.id)
  )
    throw new HttpError(
      409,
      "payment_mismatch",
      "La transacción no corresponde a esta cotización.",
    );
  const fingerprint = await sha256(`${tx.id}:${tx.status}`);
  const now = new Date().toISOString();
  // Approved orders cannot be downgraded by stale PENDING/DECLINED notifications.
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO payment_events(fingerprint,payment_id,transaction_id,status,received_at) VALUES (?,?,?,?,?) ON CONFLICT(fingerprint) DO NOTHING",
    ).bind(fingerprint, order.id, tx.id, tx.status, now),
    env.DB.prepare(
      "UPDATE payment_orders SET transaction_id=?,status=?,updated_at=? WHERE id=? AND (status NOT IN ('APPROVED','VOIDED') OR ?='VOIDED')",
    ).bind(tx.id, tx.status, now, order.id, tx.status),
    env.DB.prepare(
      "INSERT INTO audit_log(id,lead_id,actor_id,action,metadata_json,created_at) SELECT ?,lead_id,'wompi','payment.approved',?,? FROM payment_orders WHERE id=? AND status='APPROVED' AND NOT EXISTS(SELECT 1 FROM audit_log WHERE lead_id=? AND action='payment.approved' AND metadata_json=?)",
    ).bind(
      crypto.randomUUID(),
      JSON.stringify({ payment_id: order.id }),
      now,
      order.id,
      order.lead_id,
      JSON.stringify({ payment_id: order.id }),
    ),
  ]);
  const current = await env.DB.prepare(
    "SELECT status FROM payment_orders WHERE id=?",
  )
    .bind(order.id)
    .first<{ status: string }>();
  return { status: current!.status, order };
}
export async function paymentStatus(
  request: Request,
  env: Env,
  upstream: typeof fetch,
): Promise<Response> {
  requirePayments(env);
  sameOrigin(request, env.APP_BASE_URL);
  const data = z
    .object({
      token: z.string(),
      transaction_id: z
        .string()
        .regex(/^[a-zA-Z0-9-]{1,100}$/)
        .optional(),
    })
    .safeParse(await readJson(request));
  if (!data.success)
    throw new HttpError(422, "validation", "Consulta no válida.");
  const order = await orderByToken(env, data.data.token);
  if (data.data.transaction_id) {
    // Verify the reference before changing any state for a capability request.
    const host =
      env.WOMPI_ENVIRONMENT === "prod"
        ? "production.wompi.co"
        : "sandbox.wompi.co";
    const result = await upstream(
      `https://${host}/v1/transactions/${encodeURIComponent(data.data.transaction_id)}`,
      {
        headers: { Authorization: `Bearer ${env.WOMPI_PRIVATE_KEY}` },
        redirect: "manual",
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!result.ok)
      throw new HttpError(
        502,
        "verification_unavailable",
        "Wompi todavía no permite confirmar este pago.",
      );
    const body = z.object({ data: txSchema }).safeParse(await result.json());
    if (!body.success || body.data.data.reference !== order.reference)
      throw new HttpError(404, "not_found", "Transacción no disponible.");
    const checked = await reconcile(env, data.data.transaction_id, async () =>
      Response.json(body.data),
    );
    return json({ status: checked.status });
  }
  return json({ status: order.status });
}
export async function wompiWebhook(
  request: Request,
  env: Env,
  upstream: typeof fetch,
): Promise<Response> {
  requirePayments(env);
  const parsed = z
    .object({
      event: z.literal("transaction.updated"),
      environment: z.enum(["test", "prod"]),
      data: z.object({ transaction: txSchema }),
      timestamp: z.number().int().positive(),
      signature: z.object({
        properties: z.array(z.string().max(150)).min(3).max(20),
        checksum: z.string().regex(/^[a-fA-F0-9]{64}$/),
      }),
    })
    .safeParse(await readJson(request));
  if (!parsed.success)
    throw new HttpError(422, "invalid_event", "Evento inválido.");
  const event = parsed.data;
  if (event.environment !== env.WOMPI_ENVIRONMENT)
    throw new HttpError(403, "wrong_environment", "Ambiente no válido.");
  const properties = event.signature.properties;
  if (
    ![
      "transaction.id",
      "transaction.status",
      "transaction.amount_in_cents",
    ].every((p) => properties.includes(p))
  )
    throw new HttpError(403, "incomplete_signature", "Firma incompleta.");
  const values = properties
    .map((path) => {
      let value: unknown = event.data;
      for (const key of path.split(".")) {
        if (!value || typeof value !== "object" || !Object.hasOwn(value, key))
          throw new HttpError(403, "invalid_signature", "Firma no válida.");
        value = (value as Record<string, unknown>)[key];
      }
      if (!["string", "number", "boolean"].includes(typeof value))
        throw new HttpError(403, "invalid_signature", "Firma no válida.");
      return String(value);
    })
    .join("");
  const expected = await sha256(
    values + event.timestamp + env.WOMPI_EVENTS_SECRET,
  );
  let difference = 0;
  for (let i = 0; i < 64; i++)
    difference |=
      expected.charCodeAt(i) ^
      event.signature.checksum.toLowerCase().charCodeAt(i);
  if (difference)
    throw new HttpError(403, "invalid_signature", "Firma no válida.");
  const known = await env.DB.prepare(
    "SELECT id FROM payment_orders WHERE reference=?",
  )
    .bind(event.data.transaction.reference)
    .first();
  if (!known) return json({ received: true, ignored: true });
  const result = await reconcile(env, event.data.transaction.id, upstream);
  return json({ received: true, status: result.status });
}
