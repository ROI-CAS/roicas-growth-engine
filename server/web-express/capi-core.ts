/**
 * Núcleo server-side de la Conversions API de Meta.
 * Módulo SOLO servidor: lo usan el server function (eventos del navegador) y el
 * webhook de Wompi (Purchase). El token nunca sale de aquí.
 */

export interface MetaEventInput {
  pixelId?: string;
  eventName: string;
  /** Identificador único del evento — deduplica contra el Pixel del navegador. */
  eventId: string;
  eventSourceUrl?: string;
  actionSource?: "website" | "system_generated";
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  phone?: string;
  email?: string;
  value?: number;
  currency?: string;
}

async function sha256(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sendMetaEvent(input: MetaEventInput) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId =
    input.pixelId || process.env.VITE_META_PIXEL_ID || process.env.META_PIXEL_ID;

  // Sin credenciales: no-op silencioso (local sin configurar).
  if (!token || !pixelId) return { skipped: true as const };

  const userData: Record<string, unknown> = {};
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.phone) {
    const normalized = input.phone.replace(/\D/g, "");
    if (normalized) userData.ph = [await sha256(normalized)];
  }
  if (input.email) {
    const normalized = input.email.trim().toLowerCase();
    if (normalized) userData.em = [await sha256(normalized)];
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: input.actionSource ?? "website",
        ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
        user_data: userData,
        ...(input.value != null
          ? { custom_data: { value: input.value, currency: input.currency ?? "COP" } }
          : {}),
      },
    ],
  };

  const testCode = process.env.META_CAPI_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("CAPI event failed", input.eventName, res.status, err);
      return { ok: false as const, status: res.status };
    }
    return { ok: true as const };
  } catch (error) {
    console.error("CAPI event error", input.eventName, error);
    return { ok: false as const };
  }
}
