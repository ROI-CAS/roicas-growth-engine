import type { Env } from "./env";
import { hmac } from "./crypto";
import { HttpError, json, readJson } from "./http";

export async function retentionPreview(env: Env): Promise<Response> {
  const cutoff = new Date(Date.now() - 90 * 86400000).toISOString();
  const rows = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM leads l WHERE updated_at<? AND commercial_status!='ganado' AND NOT EXISTS(SELECT 1 FROM payment_orders p WHERE p.lead_id=l.id)",
  )
    .bind(cutoff)
    .first();
  const reports = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM diagnosis_jobs WHERE expires_at<=? AND report_encrypted IS NOT NULL",
  )
    .bind(Math.floor(Date.now() / 1000))
    .first();
  return json({
    inactive_uncontracted_leads: rows?.count ?? 0,
    expired_reports: reports?.count ?? 0,
    lead_retention_days: 90,
    report_retention_days: 30,
    automatic_enabled:
      env.RETENTION_ENABLED === "true" && env.LEGAL_APPROVED === "true",
  });
}
export async function eraseLead(
  request: Request,
  env: Env,
  actor: { id: string; role: string },
  id: string,
): Promise<Response> {
  if (actor.role !== "owner")
    throw new HttpError(
      403,
      "owner_required",
      "La supresión requiere al propietario.",
    );
  const body = (await readJson(request)) as { confirm_id?: unknown };
  if (body?.confirm_id !== id)
    throw new HttpError(
      422,
      "confirmation_required",
      "Confirma el identificador exacto de la solicitud.",
    );
  const lead = await env.DB.prepare(
    "SELECT commercial_status FROM leads WHERE id=?",
  )
    .bind(id)
    .first<{ commercial_status: string }>();
  if (!lead) throw new HttpError(404, "not_found", "Solicitud no encontrada.");
  const payment = await env.DB.prepare(
    "SELECT id FROM payment_orders WHERE lead_id=? LIMIT 1",
  )
    .bind(id)
    .first();
  if (lead.commercial_status === "ganado" || payment)
    throw new HttpError(
      409,
      "retention_review",
      "Este caso tiene una relación contractual o registro de pago. Requiere revisar obligaciones de conservación antes de suprimirlo.",
    );
  await env.DB.batch([
    env.DB.prepare(
      "DELETE FROM leads WHERE id=? AND commercial_status!='ganado' AND NOT EXISTS(SELECT 1 FROM payment_orders WHERE lead_id=?)",
    ).bind(id, id),
    env.DB.prepare(
      "INSERT INTO audit_log(id,actor_id,action,metadata_json,created_at) VALUES (?,?,'privacy.erased',?,?)",
    ).bind(
      crypto.randomUUID(),
      actor.id,
      JSON.stringify({
        case_hash: await hmac(env.HASH_SECRET, `erased:${id}`),
      }),
      new Date().toISOString(),
    ),
  ]);
  return json({
    erased: true,
    message:
      "Solicitud y datos vinculados eliminados. Las copias de recuperación requieren su propio plazo de caducidad.",
  });
}
export async function applyRetention(env: Env): Promise<void> {
  if (
    env.ENVIRONMENT === "preview" ||
    env.RETENTION_ENABLED !== "true" ||
    env.LEGAL_APPROVED !== "true"
  )
    return;
  const now = Math.floor(Date.now() / 1000);
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE diagnosis_jobs SET status='cancelled',report_encrypted=NULL,access_encrypted='',lease_token=NULL,lease_until=NULL,updated_at=? WHERE expires_at<=?",
    ).bind(now, now),
    env.DB.prepare(
      "UPDATE report_deliveries SET status='cancelled',dispatch_token_hash=NULL,lease_token=NULL,lease_until=NULL WHERE diagnosis_id IN (SELECT id FROM diagnosis_jobs WHERE expires_at<=?)",
    ).bind(now),
    env.DB.prepare(
      "DELETE FROM leads WHERE id IN (SELECT l.id FROM leads l WHERE l.updated_at<? AND l.commercial_status!='ganado' AND NOT EXISTS(SELECT 1 FROM payment_orders p WHERE p.lead_id=l.id) LIMIT 100)",
    ).bind(new Date(Date.now() - 90 * 86400000).toISOString()),
    env.DB.prepare("DELETE FROM rate_limits WHERE expires_at<?").bind(now),
  ]);
}
