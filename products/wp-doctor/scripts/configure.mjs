import { readFile, writeFile } from "node:fs/promises";
const environment = process.argv[2];
if (!["staging", "production"].includes(environment))
  throw new Error("Uso: node scripts/configure.mjs staging|production");
const input = JSON.parse(
  await readFile(`cloudflare.${environment}.json`, "utf8"),
);
for (const key of [
  "account_id",
  "d1_database_id",
  "app_base_url",
  "admin_base_url",
  "access_team_domain",
  "access_aud",
  "turnstile_site_key",
])
  if (!input[key] || String(input[key]).includes("REPLACE"))
    throw new Error(`Falta configuración real: ${key}`);
if (
  !/^[a-f0-9]{32}$/.test(input.account_id) ||
  !/^[a-f0-9-]{36}$/.test(input.d1_database_id)
)
  throw new Error("IDs de cuenta/D1 inválidos.");
for (const key of ["app_base_url", "admin_base_url"]) {
  const url = new URL(input[key]);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(`Se requiere origen HTTPS: ${key}`);
}
if (new URL(input.app_base_url).origin === new URL(input.admin_base_url).origin)
  throw new Error("Usar orígenes separados para público y admin.");
if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(input.access_team_domain))
  throw new Error("Dominio Access inválido.");
if (
  environment === "production" &&
  (input.legal_approved !== true ||
    !input.business_name ||
    !input.privacy_contact ||
    !/^[1-9]\d{7,14}$/.test(input.whatsapp_public_number ?? ""))
)
  throw new Error(
    "Completar revisión legal y contacto real antes de producción.",
  );
const vars = {
  ENVIRONMENT: environment,
  APP_BASE_URL: new URL(input.app_base_url).origin,
  ADMIN_BASE_URL: new URL(input.admin_base_url).origin,
  PUBLIC_DIAGNOSIS_ENABLED: input.diagnosis_enabled === true ? "true" : "false",
  DIAGNOSIS_ENGINE: input.diagnosis_enabled === true ? "pagespeed" : "disabled",
  DIAGNOSTIC_DELIVERY_ENABLED:
    input.delivery_enabled === true ? "true" : "false",
  EMAIL_FROM: input.email_from ?? "",
  DELIVERY_MODE: input.delivery_mode ?? "n8n_pdf_whatsapp",
  N8N_DISPATCH_WEBHOOK_URL:
    input.n8n_dispatch_webhook_url ??
    "https://n8n.srv1162733.hstgr.cloud/webhook/wpdoctor-delivery-v1",
  N8N_SEND_ENABLED: input.n8n_send_enabled === true ? "true" : "false",
  N8N_DOCUMENT_TEMPLATE_NAME: input.n8n_document_template_name ?? "",
  N8N_TEMPLATE_LANGUAGE: input.n8n_template_language ?? "es",
  WHATSAPP_PHONE_NUMBER_ID: input.whatsapp_phone_number_id ?? "",
  WHATSAPP_API_VERSION: input.whatsapp_api_version ?? "",
  WHATSAPP_REPORT_TEMPLATE: input.whatsapp_report_template ?? "",
  WHATSAPP_TEMPLATE_LANGUAGE: input.whatsapp_template_language ?? "es",
  TRUSTED_PROXY_REQUIRED:
    input.trusted_proxy_required === true ? "true" : "false",
  TURNSTILE_SITE_KEY: input.turnstile_site_key,
  ACCESS_TEAM_DOMAIN: input.access_team_domain,
  ACCESS_AUD: input.access_aud,
  WHATSAPP_PUBLIC_NUMBER: input.whatsapp_public_number ?? "",
  BUSINESS_NAME: input.business_name ?? "",
  BUSINESS_EMAIL: input.business_email ?? "",
  PRIVACY_CONTACT: input.privacy_contact ?? "",
  LEGAL_APPROVED: input.legal_approved === true ? "true" : "false",
  BASE_REPAIR_PRICE_COP: String(input.base_repair_price_cop ?? 189000),
  BASE_OPTIMIZATION_PRICE_COP: String(
    input.base_optimization_price_cop ?? 349000,
  ),
  BASE_MAINTENANCE_MONTHLY_COP: String(
    input.base_maintenance_monthly_cop ?? 169000,
  ),
};
for (const mode of ["public", "admin"]) {
  const config = {
    name: input[`${mode}_worker_name`] ?? `wpdoctor-${mode}-${environment}`,
    main: `../../apps/${mode}/worker.ts`,
    account_id: input.account_id,
    compatibility_date: "2026-10-15",
    workers_dev: input[`${mode}_workers_dev`] === true,
    preview_urls: false,
    routes:
      input[`${mode}_workers_dev`] === true
        ? []
        : [
            {
              pattern: new URL(
                mode === "public" ? input.app_base_url : input.admin_base_url,
              ).hostname,
              custom_domain: true,
            },
          ],
    assets: {
      directory: "../../dist/site",
      binding: "ASSETS",
      run_worker_first: true,
    },
    d1_databases: [
      {
        binding: "DB",
        database_name: input.d1_database_name ?? `wpdoctor-${environment}`,
        database_id: input.d1_database_id,
        migrations_dir: "../migrations",
      },
    ],
    vars,
    observability: { enabled: false },
    ...(mode === "public"
      ? {
          triggers: {
            crons: [
              input.diagnosis_enabled === true ? "* * * * *" : "17 * * * *",
            ],
          },
        }
      : {}),
  };
  await writeFile(
    `infra/wrangler/${mode}.${environment}.generated.json`,
    JSON.stringify(config, null, 2),
  );
}
console.log(
  `Configuración ${environment} generada. No se crearon recursos ni se desplegó código.`,
);
