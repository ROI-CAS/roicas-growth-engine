import { diagnosticReportEmail } from "./report-email";
import { isolatedConfigured, runIsolatedBrowser } from "./isolated-browser";
import { z } from "zod";
import { normalizeWebsite } from "../contracts";
import type { Env } from "./env";
import { base64, decrypt, encrypt, hmac } from "./crypto";
import { escapeHtml as e, HttpError, json, readJson } from "./http";
import { diagnosisPdf } from "./pdf";
import {
  siteEvidenceSchema,
  buildSiteEvidence,
  siteEvidenceHtml,
} from "./site-evidence";
import {
  assessBrowserRun,
  browserAssessmentSchema,
  browserReportText,
} from "./browser-report";
import {
  claimN8nDispatch,
  sendN8nDispatch,
  n8nDeliveryConfigured,
} from "./n8n-dispatch";
export { claimN8nDispatch };

const nowSeconds = () => Math.floor(Date.now() / 1000);
export function diagnosticsEnabled(env: Env): boolean {
  return (
    env.ENVIRONMENT !== "preview" &&
    env.PUBLIC_DIAGNOSIS_ENABLED === "true" &&
    env.DIAGNOSIS_ENGINE === "pagespeed"
  );
}
export function deliveryConfigured(env: Env): boolean {
  if (env.DELIVERY_MODE === "resend_email")
    return !!(
      env.PAGESPEED_API_KEY &&
      env.RESEND_API_KEY &&
      env.EMAIL_FROM &&
      /^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/.test(env.EMAIL_FROM) &&
      env.DIAGNOSTIC_DELIVERY_ENABLED === "true"
    );
  if (env.DELIVERY_MODE === "n8n_pdf_whatsapp")
    return n8nDeliveryConfigured(env);
  return !!(
    env.PAGESPEED_API_KEY &&
    env.BREVO_API_KEY &&
    env.EMAIL_FROM &&
    /^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/.test(env.EMAIL_FROM) &&
    env.WHATSAPP_API_TOKEN &&
    /^\d{5,30}$/.test(env.WHATSAPP_PHONE_NUMBER_ID ?? "") &&
    /^v\d{1,3}\.\d$/.test(env.WHATSAPP_API_VERSION ?? "") &&
    /^[a-z0-9_]{1,512}$/.test(env.WHATSAPP_REPORT_TEMPLATE ?? "") &&
    /^[a-z]{2}(?:_[A-Z]{2})?$/.test(env.WHATSAPP_TEMPLATE_LANGUAGE ?? "") &&
    env.DIAGNOSTIC_DELIVERY_ENABLED === "true"
  );
}
export async function diagnosisInsert(env: Env, id: string) {
  const token = base64(crypto.getRandomValues(new Uint8Array(32)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  const now = nowSeconds();
  const progressToken = base64(crypto.getRandomValues(new Uint8Array(32)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return env.DB.prepare(
    "INSERT INTO diagnosis_jobs(id,status,available_at,access_hash,access_encrypted,expires_at,created_at,updated_at,progress_hash,progress_encrypted) SELECT id,'queued',?,?,?,?,?,?,?,? FROM leads WHERE id=? ON CONFLICT(id) DO NOTHING",
  ).bind(
    now,
    await hmac(env.HASH_SECRET, `report:${token}`),
    await encrypt(env.DATA_ENCRYPTION_KEY, token, `${id}:report-token`),
    now + 30 * 86400,
    now,
    now,
    await hmac(env.HASH_SECRET, `progress:${progressToken}`),
    await encrypt(
      env.DATA_ENCRYPTION_KEY,
      progressToken,
      `${id}:progress-token`,
    ),
    id,
  );
}

const audit = z.object({
  score: z.number().min(0).max(1).nullable().optional(),
  numericValue: z.number().finite().nullable().optional(),
});
const providerSchema = z.object({
  lighthouseResult: z.object({
    requestedUrl: z.string(),
    finalUrl: z.string(),
    fetchTime: z.iso.datetime(),
    runtimeError: z.object({ code: z.string() }).optional(),
    categories: z.object({
      performance: z.object({ score: z.number().min(0).max(1).nullable() }),
    }),
    audits: z.record(z.string(), audit),
  }),
});
const metricSchema = z.object({
  label: z.string(),
  value: z.number().finite().nullable(),
  unit: z.enum(["ms", "score"]),
});
export const desktopMeasurementSchema = z.object({
  strategy: z.literal("desktop"),
  measuredAt: z.iso.datetime(),
  finalWebsite: z.string(),
  source: z.literal("Google PageSpeed Insights / Lighthouse"),
  performanceScore: z.number().min(0).max(100).nullable(),
  metrics: z.array(metricSchema),
});
export const reportSchema = z.object({
  version: z.literal(1),
  website: z.string(),
  finalWebsite: z.string(),
  measuredAt: z.iso.datetime(),
  source: z.enum([
    "Google PageSpeed Insights / Lighthouse",
    "Playwright / Chromium",
  ]),
  strategy: z.enum(["mobile", "desktop"]),
  performanceScore: z.number().min(0).max(100).nullable(),
  metrics: z.array(metricSchema),
  desktop: desktopMeasurementSchema.optional(),
  desktopUnavailable: z.boolean().optional(),
  observations: z.array(
    z.object({
      label: z.string(),
      state: z.enum(["observado", "alerta", "no_verificado"]),
    }),
  ),
  limits: z.array(z.string()),
  browser: browserAssessmentSchema.optional(),
  site: siteEvidenceSchema.optional(),
});
export type DiagnosisReport = z.infer<typeof reportSchema>;

class ProviderFailure extends Error {
  constructor(
    public code: string,
    public retryable: boolean,
  ) {
    super(code);
  }
}
async function providerJson(
  response: Response,
  maxBytes = 1024 * 1024,
): Promise<unknown> {
  if (!response.body) throw new ProviderFailure("provider_empty", true);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new ProviderFailure("provider_oversize", false);
    }
    chunks.push(value);
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(data));
  } catch {
    throw new ProviderFailure("provider_invalid_json", true);
  }
}
export async function runPageSpeed(
  website: string,
  env: Env,
  upstream: typeof fetch = fetch,
  strategy: "mobile" | "desktop" = "mobile",
): Promise<DiagnosisReport> {
  const normalized = normalizeWebsite(website);
  const url = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  url.searchParams.set("url", normalized);
  url.searchParams.set("strategy", strategy);
  url.searchParams.set("category", "performance");
  // Google exposes audits as a map and rejects nested wildcard field masks.
  // Receive that map with a byte limit; the schema below discards all details.
  url.searchParams.set(
    "fields",
    "lighthouseResult(requestedUrl,finalUrl,fetchTime,runtimeError,categories/performance/score,audits)",
  );
  if (env.PAGESPEED_API_KEY) url.searchParams.set("key", env.PAGESPEED_API_KEY);
  const response = await upstream(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(75000),
  });
  if (!response.ok)
    throw new ProviderFailure(
      `pagespeed_http_${response.status}`,
      response.status === 429 || response.status >= 500,
    );
  const parsed = providerSchema.safeParse(
    await providerJson(response, 4 * 1024 * 1024),
  );
  if (!parsed.success) throw new ProviderFailure("pagespeed_invalid", true);
  const data = parsed.data.lighthouseResult;
  if (data.runtimeError)
    throw new ProviderFailure("pagespeed_navigation_failed", false);
  if (normalizeWebsite(data.requestedUrl) !== normalized)
    throw new ProviderFailure("pagespeed_target_mismatch", false);
  // Keep only sanitized public homepage URLs, never query strings from redirects.
  const finalWebsite = normalizeWebsite(data.finalUrl);
  const metric = (id: string, label: string, unit: "ms" | "score") => ({
    label,
    value: data.audits[id]?.numericValue ?? null,
    unit,
  });
  const observation = (id: string, label: string) => ({
    label,
    state: (!data.audits[id] || data.audits[id]?.score == null
      ? "no_verificado"
      : data.audits[id]?.score === 1
        ? "observado"
        : "alerta") as "observado" | "alerta" | "no_verificado",
  });
  return reportSchema.parse({
    version: 1,
    website: normalized,
    finalWebsite,
    measuredAt: data.fetchTime,
    source: "Google PageSpeed Insights / Lighthouse",
    strategy,
    performanceScore:
      data.categories.performance.score === null
        ? null
        : Math.round(data.categories.performance.score * 100),
    metrics: [
      metric("first-contentful-paint", "Primera visualización", "ms"),
      metric("largest-contentful-paint", "Contenido principal (LCP)", "ms"),
      metric("total-blocking-time", "Bloqueo del navegador", "ms"),
      metric("cumulative-layout-shift", "Estabilidad visual (CLS)", "score"),
      metric("speed-index", "Índice de velocidad", "ms"),
    ],
    observations: [
      observation("http-status-code", "Respuesta de la página"),
      observation("is-on-https", "Uso de HTTPS"),
      observation("errors-in-console", "Consola del navegador"),
    ],
    limits: [
      `Medición de laboratorio ${strategy === "mobile" ? "móvil" : "en PC"} de una página, no tiempos reales de todos tus visitantes.`,
      "No verifica vulnerabilidades internas, malware, conflictos entre plugins ni la causa raíz de una caída.",
      "No envía formularios, no realiza compras ni prueba entrega de mensajes o pagos.",
      "No solicita contraseñas, no modifica tu web y no acredita que esté libre de problemas.",
    ],
  });
}
export async function runDiagnosticAudit(
  website: string,
  jobId: string,
  env: Env,
  upstream: typeof fetch = fetch,
): Promise<DiagnosisReport> {
  const browserRequested =
    !!env.BROWSER_DIAGNOSTICS_MODE &&
    env.BROWSER_DIAGNOSTICS_MODE !== "disabled";
  if (
    browserRequested &&
    !isolatedConfigured(env) &&
    (env.ENVIRONMENT !== "staging" ||
      env.BROWSER_DIAGNOSTICS_MODE !== "laboratory" ||
      !env.BROWSER_RUNNER)
  )
    throw new ProviderFailure("browser_security_gate_closed", false);
  const target = normalizeWebsite(website);
  // Run independent external checks together: 75s PageSpeed, 90s browser.
  // The RPC guard bounds a provider that never settles; the runner also closes
  // its own contexts. It never turns a missing browser result into a clean scan.
  let browserTimer: ReturnType<typeof setTimeout> | undefined;
  const browserTask = browserRequested
    ? Promise.race([
        isolatedConfigured(env)
          ? runIsolatedBrowser(env, jobId, target, upstream)
          : env.BROWSER_RUNNER!.run({ job_id: jobId, target }),
        new Promise<never>((_, reject) => {
          browserTimer = setTimeout(
            () => reject(new ProviderFailure("browser_deadline", false)),
            isolatedConfigured(env) ? 113000 : 95000,
          );
        }),
      ]).finally(() => clearTimeout(browserTimer))
    : Promise.resolve(null);
  const [mobile, desktop, browser] = await Promise.allSettled([
    runPageSpeed(target, env, upstream, "mobile"),
    runPageSpeed(target, env, upstream, "desktop"),
    browserTask,
  ]);
  if (mobile.status === "rejected") throw mobile.reason;
  const report = mobile.value;
  if (desktop.status === "fulfilled") {
    report.desktop = desktopMeasurementSchema.parse(desktop.value);
    report.limits[0] =
      "Mediciones de laboratorio independientes en móvil y PC de una página; no representan a todos tus visitantes ni comparten las mismas condiciones.";
  } else {
    report.desktopUnavailable = true;
    report.limits.push(
      "La medición de PC no estuvo disponible. No se deduce su resultado de la prueba móvil.",
    );
  }
  if (browserRequested) {
    if (browser.status === "rejected") throw browser.reason;
    const result = browser.value;
    // Reject malformed/rejected output rather than publishing an apparently clean scan.
    try {
      report.browser = assessBrowserRun(result, report.website);
      report.site = buildSiteEvidence(report, report.browser);
    } catch {
      throw new ProviderFailure("browser_result_unavailable", false);
    }
  }
  return reportSchema.parse(report);
}

function performanceText(report: DiagnosisReport): string {
  const profiles = [report, ...(report.desktop ? [report.desktop] : [])];
  return (
    profiles
      .map(
        (p) =>
          `Rendimiento ${p.strategy === "desktop" ? "PC" : "móvil"}: ${p.performanceScore ?? "No medido"}${p.performanceScore === null ? "" : "/100"}\nMedición: ${p.measuredAt}\n${p.metrics.map((m) => `${m.label}: ${m.value === null ? "No medido" : `${m.value.toFixed(m.unit === "ms" ? 0 : 3)} ${m.unit}`}`).join("\n")}`,
      )
      .join("\n\n") +
    (!report.desktop && report.strategy === "mobile"
      ? "\nRendimiento PC: No medido"
      : "")
  );
}
export function reportText(report: DiagnosisReport, link: string): string {
  return `Diagnóstico preliminar de ${report.website}\n${performanceText(report)}${report.browser ? "\n\n" + browserReportText(report.browser) : ""}\n\nInforme completo: ${link}\n\n${report.limits.join("\n")}\n\nWP Doctor · Reporte solicitado, sin suscripción promocional.`;
}
export function reportHtml(report: DiagnosisReport): string {
  const performanceSection =
    [report, ...(report.desktop ? [report.desktop] : [])]
      .map(
        (p) =>
          `<section><h2>Rendimiento ${p.strategy === "desktop" ? "PC" : "móvil"}: ${p.performanceScore ?? "No medido"}${p.performanceScore === null ? "" : "/100"}</h2><p>Medición: ${e(p.measuredAt)}</p><dl>${p.metrics.map((m) => `<dt>${e(m.label)}</dt><dd>${m.value === null ? "No medido" : `${e(m.value.toFixed(m.unit === "ms" ? 0 : 3))} ${e(m.unit)}`}</dd>`).join("")}</dl></section>`,
      )
      .join("") +
    (!report.desktop && report.strategy === "mobile"
      ? "<h2>Rendimiento PC: No medido</h2><p>No hay una medición independiente de escritorio disponible.</p>"
      : "");
  const siteSection = report.site ? siteEvidenceHtml(report.site) : "";
  const browserSection =
    report.browser && !report.site
      ? `<h2>Revisión del navegador</h2><pre style="white-space:pre-wrap;overflow-wrap:anywhere">${e(browserReportText(report.browser))}</pre>`
      : "";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Diagnóstico de WordPress | WP Doctor · Roicas</title><link rel="icon" href="/assets/brand/favicon.png"><link rel="stylesheet" href="/assets/style.css"></head><body><main class="legal wrap"><p class="eyebrow">DIAGNÓSTICO EXPRESS · INFORME PRELIMINAR</p><h1>Salud de tu página</h1><p>${e(report.website)}</p>${performanceSection}<p>Las pruebas de móvil y PC son independientes, con condiciones distintas. Una puntuación de laboratorio no garantiza tiempos reales de todos tus visitantes.</p><h2>Señales públicas</h2><ul>${report.observations.map((o) => `<li>${e(o.label)}: ${e(o.state.replaceAll("_", " "))}</li>`).join("")}</ul>${siteSection}${browserSection}<h2>Qué no comprueba este reporte</h2><ul>${report.limits.map((l) => `<li>${e(l)}</li>`).join("")}</ul><h2>Siguiente paso</h2><p>Si observas una lentitud o un fallo, el equipo puede revisar las alertas contigo y delimitar una reparación antes de intervenir. No necesitas contratar para recibir este reporte.</p><p>Este enlace es privado y caduca a los 30 días. Evita compartirlo.</p><a href="/">Volver a WP Doctor</a></main></body></html>`;
}
export async function publicReport(
  request: Request,
  env: Env,
): Promise<Response> {
  const path = new URL(request.url).pathname;
  const pdf = path.endsWith(".pdf");
  const token = path.slice("/informe/".length).replace(/\.pdf$/, "");
  if (!/^[A-Za-z0-9_-]{43}$/.test(token))
    throw new HttpError(404, "not_found", "Informe no disponible.");
  const row = await env.DB.prepare(
    "SELECT j.id,j.report_encrypted FROM diagnosis_jobs j JOIN leads l ON l.id=j.id WHERE j.access_hash=? AND j.status='ready' AND j.expires_at>? AND l.commercial_status NOT IN ('spam','solicita_no_contacto')",
  )
    .bind(await hmac(env.HASH_SECRET, `report:${token}`), nowSeconds())
    .first<{ id: string; report_encrypted: string }>();
  if (!row)
    throw new HttpError(
      404,
      "not_found",
      "Informe no disponible o enlace vencido.",
    );
  const report = reportSchema.parse(
    JSON.parse(
      await decrypt(
        env.DATA_ENCRYPTION_KEY,
        row.report_encrypted,
        `${row.id}:report`,
      ),
    ),
  );
  if (pdf) {
    const bytes = await diagnosisPdf(report);
    return new Response(request.method === "HEAD" ? null : bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=diagnostico-wordpress.pdf",
        "Content-Length": String(bytes.byteLength),
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
  return new Response(reportHtml(report), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

type Job = {
  id: string;
  attempts: number;
  website_url: string;
  lease_token: string;
};
async function generateOne(
  env: Env,
  upstream: typeof fetch,
  jobId: string | null = null,
): Promise<boolean> {
  const now = nowSeconds(),
    lease = crypto.randomUUID();
  const job = await env.DB.prepare(
    "UPDATE diagnosis_jobs SET status='running',attempts=attempts+1,lease_until=?,lease_token=?,updated_at=? WHERE id=(SELECT j.id FROM diagnosis_jobs j JOIN leads l ON l.id=j.id WHERE j.status='queued' AND (? IS NULL OR j.id=?) AND j.available_at<=? AND j.expires_at>? AND l.commercial_status NOT IN ('spam','solicita_no_contacto') ORDER BY j.created_at LIMIT 1) AND status='queued' RETURNING id,attempts,lease_token",
  )
    .bind(now + 180, lease, now, jobId, jobId, now, now)
    .first<Omit<Job, "website_url">>();
  if (!job) return false;
  try {
    const lead = await env.DB.prepare(
      "SELECT website_url FROM leads WHERE id=?",
    )
      .bind(job.id)
      .first<{ website_url: string }>();
    if (!lead) throw new ProviderFailure("lead_missing", false);
    const report = await runDiagnosticAudit(
      lead.website_url,
      job.id,
      env,
      upstream,
    );
    const cipher = await encrypt(
      env.DATA_ENCRYPTION_KEY,
      JSON.stringify(report),
      `${job.id}:report`,
    );
    await env.DB.batch([
      env.DB.prepare(
        "UPDATE diagnosis_jobs SET status='ready',report_encrypted=?,lease_token=NULL,lease_until=NULL,error_code=NULL,updated_at=? WHERE id=? AND status='running' AND lease_token=? AND expires_at>? AND EXISTS(SELECT 1 FROM leads WHERE id=? AND commercial_status NOT IN ('spam','solicita_no_contacto'))",
      ).bind(cipher, nowSeconds(), job.id, lease, nowSeconds(), job.id),
      ...(env.DELIVERY_MODE === "resend_email"
        ? (["email"] as const)
        : env.DELIVERY_MODE === "n8n_pdf_whatsapp"
          ? (["whatsapp"] as const)
          : (["email", "whatsapp"] as const)
      ).map((channel) =>
        env.DB.prepare(
          "INSERT INTO report_deliveries(id,diagnosis_id,channel,status,available_at,updated_at) SELECT ?,id,?,'queued',?,? FROM diagnosis_jobs WHERE id=? AND status='ready' ON CONFLICT(diagnosis_id,channel) DO NOTHING",
        ).bind(
          `${job.id}:${channel}`,
          channel,
          nowSeconds(),
          nowSeconds(),
          job.id,
        ),
      ),
    ]);
  } catch (error) {
    const retryable = !(error instanceof ProviderFailure) || error.retryable;
    await env.DB.prepare(
      "UPDATE diagnosis_jobs SET status=?,available_at=?,lease_token=NULL,lease_until=NULL,error_code=?,updated_at=? WHERE id=? AND status='running' AND lease_token=?",
    )
      .bind(
        retryable && job.attempts < 3 ? "queued" : "failed",
        nowSeconds() + 60 * job.attempts,
        error instanceof ProviderFailure ? error.code : "pagespeed_unavailable",
        nowSeconds(),
        job.id,
        lease,
      )
      .run();
  }
  return true;
}
type Delivery = {
  id: string;
  diagnosis_id: string;
  channel: "email" | "whatsapp";
  attempts: number;
  first_attempt_at: number;
};
async function deliverOne(env: Env, upstream: typeof fetch): Promise<boolean> {
  const now = nowSeconds(),
    lease = crypto.randomUUID();
  const delivery = await env.DB.prepare(
    "UPDATE report_deliveries SET status='sending',attempts=attempts+1,lease_until=?,lease_token=?,first_attempt_at=COALESCE(first_attempt_at,?),updated_at=? WHERE id=(SELECT d.id FROM report_deliveries d JOIN diagnosis_jobs j ON j.id=d.diagnosis_id JOIN leads l ON l.id=j.id WHERE d.status='queued' AND d.available_at<=? AND j.status='ready' AND j.expires_at>? AND l.commercial_status NOT IN ('spam','solicita_no_contacto') ORDER BY d.available_at LIMIT 1) AND status='queued' RETURNING id,diagnosis_id,channel,attempts,first_attempt_at",
  )
    .bind(now + 120, lease, now, now, now, now)
    .first<Delivery>();
  if (!delivery) return false;
  let status = "unknown",
    providerId: string | null = null,
    errorCode: string | null = null;
  try {
    const row = await env.DB.prepare(
      "SELECT j.report_encrypted,j.access_encrypted,l.email_encrypted,l.phone_encrypted FROM diagnosis_jobs j JOIN leads l ON l.id=j.id WHERE j.id=? AND j.status='ready' AND j.expires_at>? AND l.commercial_status NOT IN ('spam','solicita_no_contacto')",
    )
      .bind(delivery.diagnosis_id, nowSeconds())
      .first<{
        report_encrypted: string;
        access_encrypted: string;
        email_encrypted: string;
        phone_encrypted: string;
      }>();
    if (!row) {
      status = "cancelled";
      throw new ProviderFailure("delivery_cancelled", false);
    }
    const id = delivery.diagnosis_id;
    const report = reportSchema.parse(
      JSON.parse(
        await decrypt(
          env.DATA_ENCRYPTION_KEY,
          row.report_encrypted,
          `${id}:report`,
        ),
      ),
    );
    const access = await decrypt(
      env.DATA_ENCRYPTION_KEY,
      row.access_encrypted,
      `${id}:report-token`,
    );
    const link = new URL(`/informe/${access}`, env.APP_BASE_URL).href;
    if (env.DELIVERY_MODE === "resend_email") {
      if (delivery.channel !== "email") {
        status = "cancelled";
        throw new ProviderFailure("whatsapp_disabled", false);
      }
      // The application keeps a conservative 25min retry window, within
      // Resend's 24h deduplication window. The immutable link payload is reused.
      if (now - delivery.first_attempt_at >= 25 * 60)
        throw new ProviderFailure("idempotency_window_expired", false);
      const email = await decrypt(
        env.DATA_ENCRYPTION_KEY,
        row.email_encrypted,
        `${id}:email`,
      );
      if (!z.email().safeParse(email).success) {
        status = "failed";
        throw new ProviderFailure("email_missing", false);
      }
      const pdfLink = new URL(`/informe/${access}.pdf`, env.APP_BASE_URL).href;
      const response = await upstream("https://api.resend.com/emails", {
        method: "POST",
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `wpdoctor-report/${id}`,
        },
        body: JSON.stringify({
          from: `WP Doctor · Roicas <${env.EMAIL_FROM}>`,
          to: [email],
          reply_to: env.EMAIL_FROM,
          subject: "Tu diagnóstico de WordPress · WP Doctor",
          text: reportText(report, pdfLink),
          html: diagnosticReportEmail({
            hostname: new URL(report.website).hostname,
            mobile: report.performanceScore,
            desktop: report.desktop?.performanceScore,
            pdfUrl: pdfLink,
            webUrl: link,
          }),
        }),
      });
      if (!response.ok) {
        if (response.status === 409) {
          const error = z
            .object({ name: z.string() })
            .safeParse(await providerJson(response, 16384));
          if (
            error.success &&
            error.data.name === "concurrent_idempotent_requests"
          ) {
            status = "queued";
            throw new ProviderFailure("email_concurrent_retry", true);
          }
          throw new ProviderFailure("email_idempotency_reconcile", false);
        }
        status =
          response.status === 429 || response.status >= 500
            ? "queued"
            : "failed";
        throw new ProviderFailure(
          `email_http_${response.status}`,
          status === "queued",
        );
      }
      const data = z
        .object({ id: z.string().min(1).max(200) })
        .parse(await providerJson(response, 16384));
      providerId = data.id;
      status = "accepted";
    } else if (env.DELIVERY_MODE === "n8n_pdf_whatsapp") {
      if (delivery.channel !== "whatsapp") {
        status = "cancelled";
        throw new ProviderFailure("email_disabled", false);
      }
      providerId = await sendN8nDispatch(env, delivery.id, lease, upstream);
      status = "accepted";
    } else if (delivery.channel === "email") {
      // Brevo remembers idempotency keys for 30 minutes. Use a safety margin.
      if (now - delivery.first_attempt_at >= 25 * 60) {
        errorCode = "idempotency_window_expired";
        throw new ProviderFailure(errorCode, false);
      }
      const email = await decrypt(
        env.DATA_ENCRYPTION_KEY,
        row.email_encrypted,
        `${id}:email`,
      );
      const response = await upstream("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
        headers: {
          "api-key": env.BREVO_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: env.EMAIL_FROM, name: "WP Doctor" },
          to: [{ email }],
          headers: { idempotencyKey: delivery.diagnosis_id },
          subject: "Tu Diagnóstico de Salud Web · WP Doctor",
          textContent: reportText(report, link),
        }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          const error = z
            .object({ code: z.string() })
            .safeParse(await providerJson(response, 16384));
          if (error.success && error.data.code === "duplicate_parameter")
            throw new ProviderFailure("email_duplicate_reconcile", false);
        }
        status =
          response.status === 429 || response.status >= 500
            ? "queued"
            : "failed";
        throw new ProviderFailure(
          `email_http_${response.status}`,
          status === "queued",
        );
      }
      const data = z
        .object({ messageId: z.string().min(1).max(200) })
        .parse(await providerJson(response, 16384));
      providerId = data.messageId;
      status = "accepted";
    } else {
      const phone = await decrypt(
        env.DATA_ENCRYPTION_KEY,
        row.phone_encrypted,
        `${id}:phone`,
      );
      const response = await upstream(
        `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          redirect: "manual",
          signal: AbortSignal.timeout(15000),
          headers: {
            Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone.replace(/^\+/, ""),
            type: "template",
            template: {
              name: env.WHATSAPP_REPORT_TEMPLATE,
              language: { code: env.WHATSAPP_TEMPLATE_LANGUAGE },
              components: [
                {
                  type: "body",
                  parameters: [
                    { type: "text", text: new URL(report.website).hostname },
                    {
                      type: "text",
                      text:
                        report.performanceScore === null
                          ? "No medido"
                          : `${report.performanceScore}/100`,
                    },
                    { type: "text", text: link },
                  ],
                },
              ],
            },
          }),
        },
      );
      if (!response.ok) {
        status = "failed";
        throw new ProviderFailure(`whatsapp_http_${response.status}`, false);
      }
      const data = z
        .object({
          messages: z
            .array(z.object({ id: z.string().min(1).max(200) }))
            .min(1),
        })
        .parse(await providerJson(response, 16384));
      providerId = data.messages[0]!.id;
      status = "accepted";
    }
  } catch (error) {
    errorCode =
      errorCode ??
      (error instanceof ProviderFailure
        ? error.code
        : "provider_outcome_unknown");
    if (
      delivery.channel === "email" &&
      status === "unknown" &&
      nowSeconds() - delivery.first_attempt_at < 25 * 60 &&
      (!(error instanceof ProviderFailure) || error.retryable)
    )
      status = "queued";
    if (status === "queued" && delivery.attempts >= 5) status = "unknown";
  }
  await env.DB.prepare(
    "UPDATE report_deliveries SET status=?,provider_id=?,error_code=?,available_at=?,lease_until=NULL,lease_token=NULL,updated_at=? WHERE id=? AND status='sending' AND lease_token=?",
  )
    .bind(
      status,
      providerId,
      errorCode,
      nowSeconds() + 60 * 2 ** Math.min(delivery.attempts, 5),
      nowSeconds(),
      delivery.id,
      lease,
    )
    .run();
  return true;
}
// Progress capabilities cannot open reports. Email report capabilities are never
// returned to the submitting browser: they are delivered only to the recipient.
export async function publicDiagnosisProgress(
  request: Request,
  env: Env,
  upstream: typeof fetch,
  start: boolean,
): Promise<Response> {
  const parsed = z
    .object({ id: z.uuid(), token: z.string().regex(/^[A-Za-z0-9_-]{43}$/) })
    .strict()
    .safeParse(await readJson(request));
  if (!parsed.success)
    throw new HttpError(404, "not_found", "Solicitud no disponible.");
  const { id, token } = parsed.data;
  const hash = await hmac(env.HASH_SECRET, `progress:${token}`);
  const lookup = () =>
    env.DB.prepare(
      "SELECT j.status,j.access_encrypted FROM diagnosis_jobs j JOIN leads l ON l.id=j.id WHERE j.id=? AND j.progress_hash=? AND j.expires_at>? AND l.commercial_status NOT IN ('spam','solicita_no_contacto') AND j.status!='cancelled'",
    )
      .bind(id, hash, nowSeconds())
      .first<{ status: string; access_encrypted: string }>();
  let job = await lookup();
  if (!job) throw new HttpError(404, "not_found", "Solicitud no disponible.");
  if (start && job.status === "queued") {
    await generateOne(env, upstream, id);
    job = await lookup();
    if (!job) throw new HttpError(404, "not_found", "Solicitud no disponible.");
  }
  const delivery = await env.DB.prepare(
    "SELECT status FROM report_deliveries WHERE diagnosis_id=? AND channel=?",
  )
    .bind(id, env.DELIVERY_MODE === "resend_email" ? "email" : "whatsapp")
    .first<{ status: string }>();
  return json({
    status: job.status,
    delivery_status: delivery?.status ?? "not_scheduled",
    delivery_channel:
      env.DELIVERY_MODE === "resend_email" ? "email" : "whatsapp",
    report_url:
      job.status === "ready" && env.DELIVERY_MODE !== "resend_email"
        ? `/informe/${await decrypt(env.DATA_ENCRYPTION_KEY, job.access_encrypted, `${id}:report-token`)}.pdf`
        : null,
  });
}

export async function processDiagnostics(
  env: Env,
  upstream: typeof fetch = fetch,
): Promise<void> {
  if (env.ENVIRONMENT === "preview" || !env.DB) return;
  const now = nowSeconds();
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE diagnosis_jobs SET status=CASE WHEN attempts<3 THEN 'queued' ELSE 'failed' END,lease_token=NULL,lease_until=NULL,error_code='worker_interrupted' WHERE status='running' AND lease_until<?",
    ).bind(now),
    env.DB.prepare(
      "UPDATE report_deliveries SET status=CASE WHEN channel='email' AND first_attempt_at>? AND attempts<5 THEN 'queued' ELSE 'unknown' END,lease_token=NULL,lease_until=NULL,error_code='worker_interrupted' WHERE status='sending' AND lease_until<?",
    ).bind(now - 25 * 60, now),
    env.DB.prepare(
      "UPDATE diagnosis_jobs SET status='cancelled',report_encrypted=NULL,access_encrypted='',updated_at=? WHERE expires_at<=? OR EXISTS(SELECT 1 FROM leads WHERE leads.id=diagnosis_jobs.id AND commercial_status IN ('spam','solicita_no_contacto'))",
    ).bind(now, now),
    env.DB.prepare(
      "UPDATE report_deliveries SET status='cancelled',lease_token=NULL,lease_until=NULL,updated_at=? WHERE status IN ('queued','sending') AND diagnosis_id IN (SELECT id FROM diagnosis_jobs WHERE status='cancelled')",
    ).bind(now),
  ]);
  if (env.DELIVERY_MODE === "n8n_pdf_whatsapp")
    await env.DB.prepare(
      "UPDATE report_deliveries SET status='cancelled',error_code='email_disabled' WHERE channel='email' AND status='queued'",
    ).run();
  if (env.DELIVERY_MODE === "resend_email")
    await env.DB.prepare(
      "UPDATE report_deliveries SET status='cancelled',error_code='whatsapp_disabled' WHERE channel='whatsapp' AND status='queued'",
    ).run();
  if (!diagnosticsEnabled(env) || !deliveryConfigured(env)) return;
  // A bounded cron run: one audit and up to four delivery attempts.
  await generateOne(env, upstream);
  for (let n = 0; n < 4; n++) if (!(await deliverOne(env, upstream))) break;
}
