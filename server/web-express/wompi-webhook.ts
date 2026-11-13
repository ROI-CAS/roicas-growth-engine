import { sendMetaEvent } from "./capi-core";

/**
 * Webhook de Wompi → evento Purchase en la Conversions API.
 *
 * Wompi firma cada evento: se concatenan los valores de las propiedades listadas
 * en `signature.properties`, luego el `timestamp` y luego el secreto de eventos;
 * el SHA-256 de esa cadena debe coincidir con `signature.checksum`.
 * Sin firma válida NO se procesa nada (si no, cualquiera podría inventar ventas).
 */

interface WompiEvent {
  event?: string;
  data?: { transaction?: Record<string, unknown> };
  timestamp?: number;
  signature?: { properties?: string[]; checksum?: string };
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      source
    );
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleWompiWebhook(request: Request): Promise<Response> {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    console.error("Wompi webhook: falta WOMPI_EVENTS_SECRET");
    return json({ error: "not_configured" }, 503);
  }

  let payload: WompiEvent;
  try {
    payload = (await request.json()) as WompiEvent;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const properties = payload.signature?.properties;
  const checksum = payload.signature?.checksum;
  if (!properties?.length || !checksum || payload.timestamp == null) {
    return json({ error: "missing_signature" }, 400);
  }

  const concatenated =
    properties.map((p) => String(readPath(payload.data, p) ?? "")).join("") +
    String(payload.timestamp) +
    secret;

  if ((await sha256Hex(concatenated)).toLowerCase() !== checksum.toLowerCase()) {
    console.error("Wompi webhook: firma inválida");
    return json({ error: "invalid_signature" }, 401);
  }

  const tx = payload.data?.transaction;
  // Solo las transacciones aprobadas cuentan como venta.
  if (!tx || tx.status !== "APPROVED") {
    return json({ ok: true, ignored: true }, 200);
  }

  const amountInCents = Number(tx.amount_in_cents ?? 0);
  const customerData = tx.customer_data as Record<string, unknown> | undefined;

  await sendMetaEvent({
    eventName: "Purchase",
    // El id de transacción hace el evento idempotente ante reintentos de Wompi.
    eventId: String(tx.id ?? `wompi-${payload.timestamp}`),
    actionSource: "system_generated",
    value: amountInCents > 0 ? amountInCents / 100 : undefined,
    currency: typeof tx.currency === "string" ? tx.currency : "COP",
    email: typeof tx.customer_email === "string" ? tx.customer_email : undefined,
    phone:
      typeof customerData?.phone_number === "string" ? customerData.phone_number : undefined,
  });

  return json({ ok: true }, 200);
}
