import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";

export const POLICY_VERSION = "2026-10-17-v9";
export const FORM_VERSION = "diagnostic-report-link-v4";
export const issues = {
  errores_caidas: "Mi página presenta errores",
  lentitud: "Mi página está lenta",
  plugin_actualizacion: "Un plugin o una actualización dejó de funcionar",
  formularios_botones: "No funcionan botones o formularios",
  otro_no_se: "No sé qué está pasando",
} as const;

export function normalizeWebsite(input: string): string {
  const raw = input.trim();
  const url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
  const authority = raw.replace(/^https?:\/\//i, "").split("/")[0] ?? "";
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.hash ||
    url.port ||
    /:\d+/.test(authority)
  )
    throw new Error(
      "Usa un dominio público sin credenciales, fragmentos ni puertos.",
    );
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    host.length > 253 ||
    !host.includes(".") ||
    /^[\d.]+$/.test(host) ||
    host.includes(":") ||
    host.includes("[") ||
    host.includes("]") ||
    host
      .split(".")
      .some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) ||
    /\.(local|localhost|internal|test|invalid|onion|home|lan|arpa)$/.test(
      host,
    ) ||
    host.endsWith(".localhost")
  )
    throw new Error(
      "Escribe un dominio público válido, por ejemplo tuempresa.com.",
    );
  return `https://${host}/`;
}

export const requestSchema = z
  .object({
    website_url: z
      .string()
      .trim()
      .min(3)
      .max(2048)
      .transform((v, ctx) => {
        try {
          return normalizeWebsite(v);
        } catch {
          ctx.addIssue({
            code: "custom",
            message:
              "Escribe un dominio público válido, sin puertos ni credenciales.",
          });
          return z.NEVER;
        }
      }),
    issue_type: z.enum(
      Object.keys(issues) as [keyof typeof issues, ...(keyof typeof issues)[]],
    ),
    contact: z
      .object({
        email: z
          .email()
          .max(254)
          .transform((v) =>
            v
              .trim()
              .replace(
                /@(.+)$/,
                (_, domain: string) => `@${domain.toLowerCase()}`,
              ),
          )
          .optional(),
        whatsapp_phone: z
          .string()
          .max(30)
          .transform((value, ctx) => {
            const phone = parsePhoneNumberFromString(value, "CO");
            if (!phone?.isValid()) {
              ctx.addIssue({
                code: "custom",
                message: "Introduce un teléfono internacional válido.",
              });
              return z.NEVER;
            }
            return phone.number;
          })
          .optional(),
      })
      .strict()
      .refine((contact) => !!(contact.email || contact.whatsapp_phone), {
        path: ["email"],
        message: "Indica un correo o WhatsApp válido.",
      }),
    contact_name: z.string().trim().max(100).nullable().optional(),
    privacy_accepted: z.literal(true),
    authorization_confirmed: z.literal(true),
    marketing_opt_in: z.boolean(),
    privacy_policy_version: z.literal(POLICY_VERSION),
    authorization_text_version: z.literal(POLICY_VERSION),
    form_version: z.literal(FORM_VERSION),
    idempotency_key: z.uuid(),
    turnstile_token: z.string().min(1).max(2048),
    company: z.string().max(200).default(""),
  })
  .strict();
export type LeadRequest = z.infer<typeof requestSchema>;
export const commercialStates = [
  "nuevo",
  "pendiente_revision",
  "contactado",
  "calificado",
  "propuesta_enviada",
  "ganado",
  "perdido",
  "no_calificado",
  "spam",
  "solicita_no_contacto",
] as const;
export const leadPatchSchema = z
  .object({
    commercial_status: z.enum(commercialStates),
    note: z.string().trim().max(2000).default(""),
    next_action: z.string().trim().max(300).default(""),
    expected_version: z.number().int().nonnegative(),
  })
  .strict();
export const offerSchema = z
  .object({
    idempotency_key: z.uuid(),
    service_type: z.enum([
      "reparacion",
      "optimizacion",
      "malware",
      "mantenimiento",
    ]),
    scope_summary: z.string().trim().min(10).max(3000),
    exclusions: z.string().trim().min(5).max(2000),
    quoted_price_cop: z.number().int().min(1000).max(1000000000),
    status: z.enum(["borrador", "enviada"]),
  })
  .strict();
export const funnelEventSchema = z
  .object({
    event_name: z.enum([
      "landing_view",
      "cta_primary_click",
      "form_step1_completed",
      "form_step2_viewed",
      "whatsapp_click",
    ]),
    analytics_consent: z.literal(true),
    issue_type: z
      .enum(
        Object.keys(issues) as [
          keyof typeof issues,
          ...(keyof typeof issues)[],
        ],
      )
      .optional(),
  })
  .strict();
