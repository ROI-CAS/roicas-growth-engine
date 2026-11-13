const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/OSpBlSon5j5uMQmR9X5h/webhook-trigger/fcf5ae3e-53df-4d4b-8300-c9d3229d232c";

export type LeadPayload = {
  nombre: string;
  whatsapp: string;
  negocio: string;
  tiene_web: string;
  objetivo: string;
  urgencia: string;
  source?: string;
};

export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, source: payload.source ?? "landing" }),
  });
  if (!res.ok) {
    throw new Error(`Webhook error ${res.status}`);
  }
}
