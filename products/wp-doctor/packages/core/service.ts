import type { JWTVerifyGetKey } from "jose";
import {
  requestSchema,
  leadPatchSchema,
  offerSchema,
  funnelEventSchema,
  issues,
} from "../contracts";
import type { Env } from "./env";
import { encrypt, decrypt, hmac, unbase64 } from "./crypto";
import { authenticate, requireCommercial } from "./auth";
import { HttpError, json, readJson, sameOrigin, secure } from "./http";
import { landing, legalPage, adminPage } from "./views";
import {
  deliveryConfigured,
  diagnosticsEnabled,
  diagnosisInsert,
  publicDiagnosisProgress,
  publicReport,
  reportSchema,
  claimN8nDispatch,
} from "./diagnosis";
import { visitorIp } from "./proxy";
import { eraseLead, retentionPreview } from "./retention";
import {
  checkout,
  paymentPage,
  paymentForOffer,
  paymentStatus,
  wompiWebhook,
} from "./payments";

export interface Dependencies {
  fetch: typeof fetch;
  accessKey?: JWTVerifyGetKey;
}
const defaults: Dependencies = { fetch: (...args) => fetch(...args) };
type LeadRow = {
  id: string;
  website_url: string;
  issue_type: keyof typeof issues;
  email_encrypted: string;
  phone_encrypted: string;
  name_encrypted: string | null;
  email_domain_type: string;
  commercial_status: string;
  next_action: string;
  version: number;
  created_at: string;
  updated_at: string;
  marketing_opt_in: number;
};

export function pricing(env: Env) {
  const positive = (raw: string | undefined, fallback: number) => {
    const n = Number(raw ?? fallback);
    return Number.isSafeInteger(n) && n > 0 ? n : fallback;
  };
  return {
    repair: positive(env.BASE_REPAIR_PRICE_COP, 189000),
    optimization: positive(env.BASE_OPTIMIZATION_PRICE_COP, 349000),
    maintenance: positive(env.BASE_MAINTENANCE_MONTHLY_COP, 169000),
  };
}
export function whatsapp(env: Env, id?: string, site?: string): string | null {
  if (!/^[1-9]\d{7,14}$/.test(env.WHATSAPP_PUBLIC_NUMBER ?? "")) return null;
  const text = id
    ? `Hola WP Doctor. Quiero conversar sobre el diagnóstico de ${new URL(site!).hostname}. Mi referencia es WP-${id.slice(0, 8).toUpperCase()}.`
    : "Hola WP Doctor. Quiero consultar una reparación de WordPress.";
  return `https://wa.me/${env.WHATSAPP_PUBLIC_NUMBER}?text=${encodeURIComponent(text)}`;
}
function configured(env: Env): boolean {
  // La vista publicada desde GitHub no admite datos hasta configurar los recursos.
  if (env.ENVIRONMENT === "preview") return false;
  try {
    return (
      unbase64(env.DATA_ENCRYPTION_KEY ?? "").length === 32 &&
      (env.HASH_SECRET?.length ?? 0) >= 32 &&
      !!env.TURNSTILE_SECRET &&
      !!env.TURNSTILE_SITE_KEY &&
      (env.PUBLIC_DIAGNOSIS_ENABLED === "false" ||
        (diagnosticsEnabled(env) && deliveryConfigured(env))) &&
      (env.TRUSTED_PROXY_REQUIRED !== "true" ||
        (env.PROXY_ORIGIN_SECRET?.length ?? 0) >= 32) &&
      (env.ENVIRONMENT !== "production" ||
        (env.LEGAL_APPROVED === "true" &&
          !!env.BUSINESS_NAME &&
          !!env.PRIVACY_CONTACT &&
          !!whatsapp(env)))
    );
  } catch {
    return false;
  }
}
async function limit(
  env: Env,
  key: string,
  max: number,
  seconds: number,
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / seconds);
  const safeKey = await hmac(env.HASH_SECRET, `${key}:${bucket}`);
  const result = await env.DB.prepare(
    "INSERT INTO rate_limits(key,hits,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET hits=hits+1 RETURNING hits",
  )
    .bind(safeKey, (bucket + 1) * seconds)
    .first<{ hits: number }>();
  if (!result || result.hits > max)
    throw new HttpError(
      429,
      "rate_limited",
      "Has alcanzado el límite de solicitudes. Inténtalo más tarde.",
    );
}
async function createLead(request: Request, env: Env, deps: Dependencies) {
  sameOrigin(request, env.APP_BASE_URL);
  if (!configured(env))
    throw new HttpError(
      503,
      "not_configured",
      "La recepción de solicitudes aún no está configurada.",
    );
  const parsed = requestSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    const labels: Record<string, string> = {
      website_url:
        "Escribe un dominio público válido, sin puertos ni credenciales.",
      issue_type: "Selecciona el problema principal.",
      "contact.email": "Escribe un correo electrónico válido.",
      "contact.whatsapp_phone": "Escribe un teléfono internacional válido.",
      privacy_accepted: "Acepta la política de tratamiento de datos.",
      authorization_confirmed:
        "Confirma que estás autorizado para solicitar la revisión.",
      privacy_policy_version: "La política cambió. Actualiza la página.",
      authorization_text_version:
        "La autorización cambió. Actualiza la página.",
      turnstile_token: "Completa la verificación de seguridad.",
    };
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      fields[path] ??=
        labels[path] ??
        "Revisa este campo o actualiza la página para volver a enviar.";
    }
    throw new HttpError(
      422,
      "validation",
      "Revisa los campos de la solicitud.",
      fields,
    );
  }
  const data = parsed.data;
  if (env.DELIVERY_MODE === "resend_email" && !data.contact.email)
    throw new HttpError(
      422,
      "validation",
      "Indica el correo donde recibirás tu diagnóstico.",
      { "contact.email": "Introduce un correo válido." },
    );
  if (env.DELIVERY_MODE !== "resend_email" && !data.contact.whatsapp_phone)
    throw new HttpError(422, "validation", "Indica tu WhatsApp.", {
      "contact.whatsapp_phone": "Introduce un WhatsApp válido.",
    });
  if (data.company)
    throw new HttpError(
      422,
      "submission_rejected",
      "No fue posible aceptar esta solicitud.",
    );
  const ip = await visitorIp(request, env);
  await limit(env, `submit:${ip}`, 30, 3600);
  const { turnstile_token, idempotency_key, ...stable } = data;
  const idem = await hmac(env.HASH_SECRET, `idempotency:${idempotency_key}`);
  const fingerprint = await hmac(env.HASH_SECRET, JSON.stringify(stable));
  const existing = await env.DB.prepare(
    "SELECT id,request_hash,website_url FROM leads WHERE idempotency_hash=?",
  )
    .bind(idem)
    .first<{ id: string; request_hash: string; website_url: string }>();
  const response = async (id: string, site: string) => {
    const job = diagnosticsEnabled(env)
      ? await env.DB.prepare(
          "SELECT id,status,progress_encrypted,expires_at FROM diagnosis_jobs WHERE id=?",
        )
          .bind(id)
          .first<{
            id: string;
            status: string;
            progress_encrypted: string | null;
            expires_at: number;
          }>()
      : null;
    return json(
      {
        request_id: id,
        diagnosis_id: job?.id ?? null,
        progress_token:
          job &&
          job.progress_encrypted &&
          job.expires_at > Math.floor(Date.now() / 1000) &&
          job.status !== "cancelled"
            ? await decrypt(
                env.DATA_ENCRYPTION_KEY,
                job.progress_encrypted,
                `${id}:progress-token`,
              )
            : null,
        request_status: "solicitud_recibida",
        dispatch_status: job?.status ?? "not_scheduled",
        reason: job ? "diagnosis_queued" : "diagnosis_disabled",
        whatsapp_url: whatsapp(env, id, site),
      },
      202,
    );
  };
  if (existing) {
    if (existing.request_hash !== fingerprint)
      throw new HttpError(
        409,
        "idempotency_conflict",
        "La clave ya se usó para otra solicitud.",
      );
    return response(existing.id, existing.website_url);
  }
  const verification = await deps.fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: turnstile_token,
        remoteip: ip === "local" ? undefined : ip,
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "manual",
    },
  );
  if (!verification.ok)
    throw new HttpError(
      503,
      "verification_unavailable",
      "No pudimos comprobar la solicitud. Vuelve a intentarlo.",
    );
  const result = (await verification.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  if (
    result.success !== true ||
    result.hostname !== new URL(env.APP_BASE_URL).hostname ||
    result.action !== "request_lead"
  )
    throw new HttpError(
      422,
      "turnstile_invalid",
      "Completa nuevamente la verificación de seguridad.",
    );
  await limit(env, `domain:${data.website_url}`, 6, 86400);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const [email, phone, name] = await Promise.all([
    encrypt(env.DATA_ENCRYPTION_KEY, data.contact.email ?? "", `${id}:email`),
    encrypt(
      env.DATA_ENCRYPTION_KEY,
      data.contact.whatsapp_phone ?? "",
      `${id}:phone`,
    ),
    data.contact_name
      ? encrypt(env.DATA_ENCRYPTION_KEY, data.contact_name, `${id}:name`)
      : null,
  ]);
  const domainType = !data.contact.email
    ? "not_provided"
    : /@(gmail\.com|googlemail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com|live\.com)$/i.test(
          data.contact.email,
        )
      ? "public"
      : "unknown";
  const emailQuotaHash =
    diagnosticsEnabled(env) &&
    env.DELIVERY_MODE === "resend_email" &&
    data.contact.email
      ? await hmac(
          env.HASH_SECRET,
          `diagnosis-email:${data.contact.email.trim().toLowerCase()}`,
        )
      : null;
  // The conditional insert and job insert share one serialized D1 transaction.
  // Only queued/running/completed jobs in the rolling 30-day window use a slot.
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO leads(id,idempotency_hash,request_hash,website_url,issue_type,email_encrypted,phone_encrypted,name_encrypted,email_domain_type,marketing_opt_in,created_at,updated_at,diagnosis_email_hash) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,? WHERE ? IS NULL OR (SELECT COUNT(*) FROM leads l JOIN diagnosis_jobs j ON j.id=l.id WHERE l.diagnosis_email_hash=? AND l.created_at>? AND j.status NOT IN ('failed','cancelled'))<2 ON CONFLICT(idempotency_hash) DO NOTHING",
    ).bind(
      id,
      idem,
      fingerprint,
      data.website_url,
      data.issue_type,
      email,
      phone,
      name,
      domainType,
      data.marketing_opt_in ? 1 : 0,
      now,
      now,
      emailQuotaHash,
      emailQuotaHash,
      emailQuotaHash,
      new Date(Date.now() - 30 * 86400000).toISOString(),
    ),
    env.DB.prepare(
      "INSERT INTO lead_consents(lead_id,privacy_version,authorization_version,marketing_version,accepted_at,form_version) SELECT id,?,?,?,?,? FROM leads WHERE id=? ON CONFLICT(lead_id) DO NOTHING",
    ).bind(
      data.privacy_policy_version,
      data.authorization_text_version,
      data.marketing_opt_in ? data.privacy_policy_version : null,
      now,
      data.form_version,
      id,
    ),
    env.DB.prepare(
      "INSERT INTO audit_log(id,lead_id,actor_id,action,metadata_json,created_at) SELECT ?,id,?,?,?,? FROM leads WHERE id=?",
    ).bind(crypto.randomUUID(), "public", "lead.created", "{}", now, id),
    env.DB.prepare(
      "INSERT INTO funnel_events(id,event_name,issue_type,lead_id,occurred_at) SELECT ?,?,?,id,? FROM leads WHERE id=?",
    ).bind(crypto.randomUUID(), "lead_submitted", data.issue_type, now, id),
    ...(diagnosticsEnabled(env) ? [await diagnosisInsert(env, id)] : []),
  ]);
  const saved = await env.DB.prepare(
    "SELECT id,request_hash,website_url FROM leads WHERE idempotency_hash=?",
  )
    .bind(idem)
    .first<{ id: string; request_hash: string; website_url: string }>();
  if (!saved && emailQuotaHash)
    throw new HttpError(
      429,
      "email_diagnosis_limit",
      "Se alcanzó el cupo de dos diagnósticos gratuitos por correo en 30 días. Si necesitas revisar otra web, escríbenos por WhatsApp o a wpdoctor@roicas.com y te ayudaremos.",
    );
  if (!saved || saved.request_hash !== fingerprint)
    throw new HttpError(
      409,
      "idempotency_conflict",
      "La solicitud cambió durante el envío.",
    );
  return response(saved.id, saved.website_url);
}

async function adminApi(
  request: Request,
  env: Env,
  deps: Dependencies,
  path: string,
): Promise<Response> {
  const user = await authenticate(request, env, deps.accessKey);
  requireCommercial(user.role);
  await limit(env, `admin:${user.id}`, 200, 60);
  if (request.method !== "GET") sameOrigin(request, env.ADMIN_BASE_URL);
  if (path === "/api/v1/admin/privacy/retention" && request.method === "GET") {
    if (user.role !== "owner") throw new HttpError(403, "owner_required", "Requiere al propietario.");
    return retentionPreview(env);
  }
  const erasure = path.match(/^\/api\/v1\/admin\/leads\/([a-f0-9-]{36})\/erase$/);
  if (erasure && request.method === "POST") return eraseLead(request, env, user, erasure[1]!);
  if (path === "/api/v1/admin/me")
    return json({ email: user.email, role: user.role });
  const diagnosticPath = path.match(
    /^\/api\/v1\/admin\/leads\/([a-f0-9-]{36})\/diagnosis$/,
  );
  if (diagnosticPath && request.method === "GET") {
    const job = await env.DB.prepare(
      "SELECT id,status,attempts,error_code,report_encrypted,expires_at FROM diagnosis_jobs WHERE id=?",
    )
      .bind(diagnosticPath[1]!)
      .first<{
        id: string;
        status: string;
        attempts: number;
        error_code: string | null;
        report_encrypted: string | null;
        expires_at: number;
      }>();
    if (!job) return json({ diagnosis: null, deliveries: [] });
    const deliveries = await env.DB.prepare(
      "SELECT channel,status,attempts,error_code,updated_at FROM report_deliveries WHERE diagnosis_id=?",
    )
      .bind(job.id)
      .all();
    return json({
      diagnosis: {
        id: job.id,
        status: job.status,
        attempts: job.attempts,
        error_code: job.error_code,
        expires_at: job.expires_at,
        report: job.report_encrypted
          ? reportSchema.parse(
              JSON.parse(
                await decrypt(
                  env.DATA_ENCRYPTION_KEY,
                  job.report_encrypted,
                  `${job.id}:report`,
                ),
              ),
            )
          : null,
      },
      deliveries: deliveries.results,
    });
  }
  if (path === "/api/v1/admin/funnel" && request.method === "GET") {
    const stages = await env.DB.prepare(
      "SELECT commercial_status AS stage,COUNT(*) AS count FROM leads GROUP BY commercial_status",
    ).all();
    const offers = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM commercial_offers WHERE status='enviada'",
    ).first();
    const events = await env.DB.prepare(
      "SELECT event_name,COUNT(*) AS count FROM funnel_events GROUP BY event_name",
    ).all();
    return json({
      stages: stages.results,
      events: events.results,
      offers_sent: offers,
      cac: null,
      gross_margin: null,
      note: "Eventos públicos solo con consentimiento; son eventos, no visitantes únicos. CAC y margen requieren gasto y costes técnicos. Venta ganada no implica cobro.",
    });
  }
  if (path === "/api/v1/admin/leads" && request.method === "GET") {
    const url = new URL(request.url);
    const offset = Math.min(
      10000,
      Math.max(0, Number(url.searchParams.get("offset")) || 0),
    );
    const rows = await env.DB.prepare(
      "SELECT id,website_url,issue_type,commercial_status,created_at,version FROM leads ORDER BY created_at DESC,id DESC LIMIT 50 OFFSET ?",
    )
      .bind(offset)
      .all();
    return json({
      leads: rows.results,
      next_offset: rows.results.length === 50 ? offset + 50 : null,
    });
  }
  const paymentMatch = path.match(/^\/api\/v1\/admin\/offers\/([a-f0-9-]{36})\/payment$/);
  if (paymentMatch && request.method === "POST") {
    return paymentForOffer(env, paymentMatch[1]!, user.id);
  }
  const match = path.match(
    /^\/api\/v1\/admin\/leads\/([a-f0-9-]{36})(\/offers)?$/,
  );
  if (!match) throw new HttpError(404, "not_found", "No encontrado.");
  const id = match[1]!;
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id=?")
    .bind(id)
    .first<LeadRow>();
  if (!lead) throw new HttpError(404, "not_found", "Solicitud no encontrada.");
  if (request.method === "GET" && !match[2]) {
    const consents = await env.DB.prepare(
      "SELECT * FROM lead_consents WHERE lead_id=?",
    )
      .bind(id)
      .first();
    const notes = await env.DB.prepare(
      "SELECT id,actor_id,note_encrypted,created_at FROM commercial_notes WHERE lead_id=? ORDER BY created_at DESC LIMIT 100",
    )
      .bind(id)
      .all<{
        id: string;
        actor_id: string;
        note_encrypted: string;
        created_at: string;
      }>();
    const offers = await env.DB.prepare(
      "SELECT * FROM commercial_offers WHERE lead_id=? ORDER BY created_at DESC LIMIT 100",
    )
      .bind(id)
      .all<{
        id: string;
        service_type: string;
        scope_encrypted: string;
        exclusions_encrypted: string;
        quoted_price_cop: number;
        status: string;
        created_at: string;
      }>();
    await env.DB.prepare(
      "INSERT INTO audit_log(id,lead_id,actor_id,action,metadata_json,created_at) VALUES (?,?,?,?,?,?)",
    )
      .bind(
        crypto.randomUUID(),
        id,
        user.id,
        "lead.viewed",
        "{}",
        new Date().toISOString(),
      )
      .run();
    return json({
      lead: {
        id,
        website_url: lead.website_url,
        issue_type: lead.issue_type,
        email_domain_type: lead.email_domain_type,
        commercial_status: lead.commercial_status,
        next_action: lead.next_action
          ? await decrypt(
              env.DATA_ENCRYPTION_KEY,
              lead.next_action,
              `${id}:next`,
            )
          : "",
        version: lead.version,
        created_at: lead.created_at,
        marketing_opt_in: !!lead.marketing_opt_in,
        email: await decrypt(
          env.DATA_ENCRYPTION_KEY,
          lead.email_encrypted,
          `${id}:email`,
        ),
        phone: await decrypt(
          env.DATA_ENCRYPTION_KEY,
          lead.phone_encrypted,
          `${id}:phone`,
        ),
        name: lead.name_encrypted
          ? await decrypt(
              env.DATA_ENCRYPTION_KEY,
              lead.name_encrypted,
              `${id}:name`,
            )
          : null,
      },
      consents,
      notes: await Promise.all(
        notes.results.map(async (note) => ({
          id: note.id,
          actor_id: note.actor_id,
          created_at: note.created_at,
          note: await decrypt(
            env.DATA_ENCRYPTION_KEY,
            note.note_encrypted,
            `${id}:note`,
          ),
        })),
      ),
      offers: await Promise.all(
        offers.results.map(async (offer) => ({
          id: offer.id,
          service_type: offer.service_type,
          quoted_price_cop: offer.quoted_price_cop,
          status: offer.status,
          created_at: offer.created_at,
          scope_summary: await decrypt(
            env.DATA_ENCRYPTION_KEY,
            offer.scope_encrypted,
            `${id}:scope`,
          ),
          exclusions: await decrypt(
            env.DATA_ENCRYPTION_KEY,
            offer.exclusions_encrypted,
            `${id}:exclusions`,
          ),
        })),
      ),
    });
  }
  if (request.method === "PATCH" && !match[2]) {
    const parsed = leadPatchSchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new HttpError(422, "validation", "Revisa el estado y la nota.");
    const data = parsed.data;
    const marker = crypto.randomUUID();
    const now = new Date().toISOString();
    if (
      lead.commercial_status === "solicita_no_contacto" &&
      data.commercial_status !== "solicita_no_contacto" &&
      (user.role !== "owner" || data.note.length < 10)
    )
      throw new HttpError(
        403,
        "no_contact",
        "El responsable debe documentar la autorización antes de levantar una restricción de contacto.",
      );
    const next = await encrypt(
      env.DATA_ENCRYPTION_KEY,
      data.next_action,
      `${id}:next`,
    );
    const statements = [
      env.DB.prepare(
        "UPDATE leads SET commercial_status=?,next_action=?,updated_at=?,version=version+1,last_mutation=?,marketing_opt_in=CASE WHEN ?='solicita_no_contacto' THEN 0 ELSE marketing_opt_in END WHERE id=? AND version=?",
      ).bind(
        data.commercial_status,
        next,
        now,
        marker,
        data.commercial_status,
        id,
        data.expected_version,
      ),
      env.DB.prepare(
        "INSERT INTO audit_log(id,lead_id,actor_id,action,metadata_json,created_at) SELECT ?,id,?,?,?,? FROM leads WHERE id=? AND last_mutation=?",
      ).bind(
        crypto.randomUUID(),
        user.id,
        "lead.updated",
        JSON.stringify({ status: data.commercial_status }),
        now,
        id,
        marker,
      ),
    ];
    if (data.note)
      statements.push(
        env.DB.prepare(
          "INSERT INTO commercial_notes(id,lead_id,actor_id,note_encrypted,created_at) SELECT ?,id,?,?,? FROM leads WHERE id=? AND last_mutation=?",
        ).bind(
          crypto.randomUUID(),
          user.id,
          await encrypt(env.DATA_ENCRYPTION_KEY, data.note, `${id}:note`),
          now,
          id,
          marker,
        ),
      );
    const updated = await env.DB.batch(statements);
    if (!updated[0]?.meta.changes)
      throw new HttpError(
        409,
        "stale_version",
        "Otra persona modificó la solicitud. Actualiza la ficha.",
      );
    return json({ saved: true, version: data.expected_version + 1 });
  }
  if (request.method === "POST" && match[2]) {
    if (["solicita_no_contacto", "spam"].includes(lead.commercial_status))
      throw new HttpError(
        409,
        "no_contact",
        "Esta solicitud está marcada para no contactar.",
      );
    const parsed = offerSchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new HttpError(
        422,
        "validation",
        "Completa alcance, exclusiones y precio válido.",
      );
    const data = parsed.data;
    const offerId = crypto.randomUUID();
    const now = new Date().toISOString();
    const fingerprint = await hmac(env.HASH_SECRET, JSON.stringify(data));
    const p = pricing(env);
    const base =
      data.service_type === "reparacion"
        ? p.repair
        : data.service_type === "optimizacion"
          ? p.optimization
          : data.service_type === "mantenimiento"
            ? p.maintenance
            : null;
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO commercial_offers(id,lead_id,idempotency_key,request_hash,service_type,scope_encrypted,exclusions_encrypted,quoted_price_cop,starting_price_cop_snapshot,reviewed_by,status,created_at,sent_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM leads WHERE id=? AND commercial_status NOT IN ('solicita_no_contacto','spam')) ON CONFLICT(idempotency_key) DO NOTHING",
      ).bind(
        offerId,
        id,
        data.idempotency_key,
        fingerprint,
        data.service_type,
        await encrypt(
          env.DATA_ENCRYPTION_KEY,
          data.scope_summary,
          `${id}:scope`,
        ),
        await encrypt(
          env.DATA_ENCRYPTION_KEY,
          data.exclusions,
          `${id}:exclusions`,
        ),
        data.quoted_price_cop,
        base,
        user.id,
        data.status,
        now,
        data.status === "enviada" ? now : null,
        id,
      ),
      env.DB.prepare(
        "INSERT INTO audit_log(id,lead_id,actor_id,action,metadata_json,created_at) SELECT ?,lead_id,?,?,?,? FROM commercial_offers WHERE id=?",
      ).bind(
        crypto.randomUUID(),
        user.id,
        "offer.recorded",
        JSON.stringify({ status: data.status }),
        now,
        offerId,
      ),
      env.DB.prepare(
        "UPDATE leads SET commercial_status='propuesta_enviada',version=version+1,updated_at=? WHERE id=? AND EXISTS(SELECT 1 FROM commercial_offers WHERE id=? AND status='enviada')",
      ).bind(now, id, offerId),
    ]);
    const saved = await env.DB.prepare(
      "SELECT id,lead_id,request_hash FROM commercial_offers WHERE idempotency_key=?",
    )
      .bind(data.idempotency_key)
      .first<{ id: string; lead_id: string; request_hash: string }>();
    if (!saved || saved.lead_id !== id || saved.request_hash !== fingerprint)
      throw new HttpError(
        409,
        "idempotency_conflict",
        "La clave de la oferta ya está en uso.",
      );
    return json(
      {
        id: saved.id,
        saved: true,
        message: "Oferta registrada. No se ha enviado ningún mensaje.",
      },
      201,
    );
  }
  throw new HttpError(405, "method", "Método no permitido.");
}

export function createHandler(
  mode: "public" | "admin",
  overrides: Partial<Dependencies> = {},
) {
  const deps = { ...defaults, ...overrides };
  return async (request: Request, env: Env): Promise<Response> => {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      if (mode === "admin") {
        if (path.startsWith("/api/v1/admin/"))
          return secure(await adminApi(request, env, deps, path), true);
        const user = await authenticate(request, env, deps.accessKey);
        requireCommercial(user.role);
        if (path.startsWith("/assets/"))
          return secure(await env.ASSETS.fetch(request), true);
        if (path === "/" && request.method === "GET")
          return secure(
            new Response(adminPage(), {
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }),
            true,
          );
        throw new HttpError(404, "not_found", "No encontrado.");
      }
      if (path.startsWith("/api/v1/admin") || path.startsWith("/admin"))
        throw new HttpError(404, "not_found", "No encontrado.");
      if (path === "/api/v1/payments/wompi/events" && request.method === "POST")
        return secure(await wompiWebhook(request, env, deps.fetch));
      if (["/api/v1/payments/checkout", "/api/v1/payments/status"].includes(path) && request.method === "POST") {
        await limit(env, `payment:${await visitorIp(request, env)}`, 60, 3600);
        return secure(await (path.endsWith("/checkout") ? checkout(request, env) : paymentStatus(request, env, deps.fetch)));
      }
      const paymentPath = path.match(/^\/pagar\/([A-Za-z0-9_-]{43})$/);
      if (paymentPath && request.method === "GET")
        return secure(await paymentPage(request, env, paymentPath[1]!));
      if (path === "/api/v1/requests" && request.method === "POST")
        return secure(await createLead(request, env, deps));
      if (
        ["/api/v1/diagnosis/start", "/api/v1/diagnosis/status"].includes(
          path,
        ) &&
        request.method === "POST"
      ) {
        sameOrigin(request, env.APP_BASE_URL);
        if (!configured(env) || !diagnosticsEnabled(env))
          throw new HttpError(
            503,
            "not_configured",
            "El diagnóstico automático no está habilitado.",
          );
        const start = path.endsWith("/start");
        await limit(
          env,
          `${start ? "diagnosis-start" : "diagnosis-status"}:${await visitorIp(request, env)}`,
          start ? 30 : 240,
          start ? 3600 : 60,
        );
        return secure(
          await publicDiagnosisProgress(request, env, deps.fetch, start),
        );
      }
      if (path === "/api/v1/dispatch/claim" && request.method === "POST")
        return secure(await claimN8nDispatch(request, env));
      if (path === "/api/v1/funnel-events" && request.method === "POST") {
        sameOrigin(request, env.APP_BASE_URL);
        if (!configured(env))
          throw new HttpError(503, "not_configured", "Medición no disponible.");
        const event = funnelEventSchema.safeParse(await readJson(request));
        if (!event.success)
          throw new HttpError(422, "validation", "Evento inválido.");
        await limit(env, `events:${await visitorIp(request, env)}`, 240, 3600);
        await env.DB.prepare(
          "INSERT INTO funnel_events(id,event_name,issue_type,occurred_at) VALUES (?,?,?,?)",
        )
          .bind(
            crypto.randomUUID(),
            event.data.event_name,
            event.data.issue_type ?? null,
            new Date().toISOString(),
          )
          .run();
        return secure(json({ recorded: true }, 202));
      }
      if (path === "/api/v1/public/config" && request.method === "GET") {
        if (env.TRUSTED_PROXY_REQUIRED === "true") await visitorIp(request, env);
        return secure(
          json({
            enabled: configured(env),
            site_key: env.TURNSTILE_SITE_KEY || null,
            whatsapp_url: whatsapp(env),
            diagnosis_enabled: configured(env) && diagnosticsEnabled(env),
            prices: pricing(env),
          }),
        );
      }
      if (path === "/api/v1/public/pricing" && request.method === "GET")
        return secure(
          json({ currency: "COP", ...pricing(env), final_quote: false }),
        );
      if (
        path.startsWith("/informe/") &&
        ["GET", "HEAD"].includes(request.method)
      )
        return secure(await publicReport(request, env));
      if (path === "/api/health/live") return secure(json({ status: "ok" }));
      if (path === "/api/health/ready")
        return secure(
          json(
            { status: configured(env) ? "ready" : "configuration_required" },
            configured(env) ? 200 : 503,
          ),
        );
      if (path.startsWith("/assets/") && request.method === "GET")
        return secure(await env.ASSETS.fetch(request));
      if (
        request.method === "GET" &&
        ["/", "/privacidad", "/condiciones"].includes(path)
      )
        return secure(
          new Response(
            path === "/"
              ? landing(env, pricing(env), whatsapp(env))
              : legalPage(env, path),
            { headers: { "Content-Type": "text/html; charset=utf-8" } },
          ),
        );
      if (path === "/robots.txt")
        return secure(
          new Response("User-agent: *\nDisallow: /api/\n", {
            headers: { "Content-Type": "text/plain" },
          }),
        );
      throw new HttpError(404, "not_found", "No encontrado.");
    } catch (error) {
      if (error instanceof HttpError)
        return secure(
          json(
            { error: error.code, message: error.message, fields: error.fields },
            error.status,
          ),
          mode === "admin",
        );
      // No log de payloads, contactos, tokens ni errores de proveedor.
      return secure(
        json(
          {
            error: "temporarily_unavailable",
            message: "No pudimos completar la operación. Vuelve a intentarlo.",
          },
          503,
        ),
        mode === "admin",
      );
    }
  };
}
