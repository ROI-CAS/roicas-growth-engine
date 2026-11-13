import { z } from "zod";
import { safeMessage, safeUrl } from "../runner/policy";
import {
  resourceSchema,
  technologySchema,
  detectTechnologies,
} from "./site-evidence";

const profileName = z.enum(["desktop", "mobile"]);
const runState = z.enum(["completed", "partial", "failed"]);
const rawRun = z.object({
  target: z.url().max(2048),
  measured_at: z.iso.datetime(),
  policy_version: z.string().min(1).max(100),
  status: runState,
  browser_closed: z.boolean(),
  profiles: z
    .array(
      z.object({
        profile: profileName,
        status: runState,
        reason: z.string().max(400).nullable(),
        http_status: z.number().int().min(100).max(599).nullable(),
        blocked: z.number().int().min(0).max(10000),
        resources: z.array(resourceSchema).max(100).optional(),
        generator: z.string().max(100).optional(),
        hints: z
          .array(z.enum(["rankmath"]))
          .max(1)
          .optional(),
        evidence: z
          .array(
            z.object({
              kind: z.enum([
                "http",
                "javascript",
                "console",
                "transport",
                "blocked",
              ]),
              url: z.string().max(2048),
              message: z.string().max(4096),
              status: z.number().int().min(100).max(599).optional(),
            }),
          )
          .max(60),
      }),
    )
    .max(2),
});

export const browserAssessmentSchema = z.object({
  source: z.literal("Playwright / Chromium"),
  measuredAt: z.iso.datetime(),
  policyVersion: z.string().max(100),
  status: runState,
  coverageLimited: z.boolean(),
  technologies: z.array(technologySchema).max(50).optional(),
  resources: z.array(resourceSchema).max(120).optional(),
  profiles: z
    .array(
      z.object({
        profile: profileName,
        status: runState,
        httpStatus: z.number().int().min(100).max(599).nullable(),
        blockedRequests: z.number().int().min(0).max(10000),
      }),
    )
    .max(2),
  findings: z
    .array(
      z.object({
        category: z.enum(["http", "javascript", "console", "transport"]),
        title: z.string().max(160),
        evidence: z.string().max(400),
        url: z.string().max(300),
        profiles: z.array(profileName).min(1).max(2),
        assessment: z.literal("observado"),
        impact: z.string().max(300),
        nextCheck: z.string().max(400),
      }),
    )
    .max(80),
  limitations: z.array(z.string().max(500)).max(12),
});
export type BrowserAssessment = z.infer<typeof browserAssessmentSchema>;
type Finding = BrowserAssessment["findings"][number];

const explanations = {
  http: {
    title: "Respuesta HTTP de error",
    impact:
      "El recurso devolvió un error durante esta visita; su efecto depende de la función que cumple.",
    nextCheck:
      "Revisar la URL afectada y los registros del servidor antes de atribuir una causa interna.",
  },
  javascript: {
    title: "Excepción JavaScript",
    impact:
      "Puede interrumpir una función de la página; no demuestra por sí sola que todo el sitio falle.",
    nextCheck:
      "Reproducir la función afectada y revisar el script y su contexto. No se confirma un plugin causante.",
  },
  console: {
    title: "Mensaje de error en consola",
    impact:
      "La página emitió un mensaje de error; requiere contraste con un fallo visible.",
    nextCheck:
      "Comprobar si el mensaje corresponde a una función necesaria o a un servicio opcional.",
  },
  transport: {
    title: "Solicitud sin respuesta completa",
    impact:
      "No se completó una solicitud; puede depender de la conexión, del servidor o del entorno de prueba.",
    nextCheck:
      "Repetir la solicitud en un entorno autorizado y contrastar conectividad y registros.",
  },
} as const;

/** Consume only private runner output. Screenshots and unknown fields never enter the report. */
export function assessBrowserRun(
  input: unknown,
  expectedTarget: string,
): BrowserAssessment {
  const run = rawRun.parse(input);
  if (run.target !== expectedTarget) throw new Error("browser_target_mismatch");
  if (new Set(run.profiles.map((p) => p.profile)).size !== run.profiles.length)
    throw new Error("browser_duplicate_profiles");
  const findings = new Map<string, Finding>();
  let truncated = false;
  const limited =
    run.status !== "completed" ||
    !run.browser_closed ||
    run.profiles.length !== 2 ||
    run.profiles.some((p) => p.status !== "completed" || p.blocked > 0);
  for (const p of run.profiles) {
    const blocked = new Set(
      p.evidence.filter((e) => e.kind === "blocked").map((e) => safeUrl(e.url)),
    );
    const httpErrors = new Set(
      p.evidence
        .filter((e) => e.kind === "http" && (e.status ?? 0) >= 400)
        .map((e) => safeUrl(e.url)),
    );
    for (const item of p.evidence) {
      if (item.kind === "blocked") continue;
      const url = safeUrl(item.url);
      if (item.kind === "transport" && httpErrors.has(url)) continue;
      // Generic browser network messages provide no new evidence beyond the
      // concrete HTTP event, or may be a consequence of our own blocked calls.
      if (
        item.kind === "console" &&
        /^Failed to load resource:/i.test(item.message) &&
        ((p.blocked > 0 &&
          /net::ERR_FAILED|net::ERR_BLOCKED_BY_CLIENT/i.test(item.message)) ||
          (httpErrors.size > 0 &&
            /server responded with a status of [45]\d\d/i.test(item.message)))
      )
        continue;
      // An aborted request caused by our restrictions is not a site failure.
      if (
        (item.kind === "transport" || item.kind === "http") &&
        blocked.has(url)
      )
        continue;
      if (
        item.kind === "http" &&
        (item.status === undefined || item.status < 400)
      )
        continue;
      const evidence =
        item.kind === "http"
          ? `HTTP ${item.status}`
          : safeMessage(item.message);
      const key = JSON.stringify([item.kind, url, evidence]);
      const existing = findings.get(key);
      if (existing) {
        if (!existing.profiles.includes(p.profile))
          existing.profiles.push(p.profile);
      } else if (findings.size < 80) {
        findings.set(key, {
          category: item.kind,
          ...explanations[item.kind],
          evidence,
          url,
          profiles: [p.profile],
          assessment: "observado",
        });
      } else truncated = true;
    }
  }
  return browserAssessmentSchema.parse({
    source: "Playwright / Chromium",
    measuredAt: run.measured_at,
    policyVersion: run.policy_version,
    status: run.status,
    coverageLimited: limited || truncated,
    technologies: detectTechnologies(
      run.profiles.map((p) => ({
        url: run.target,
        generator: p.generator,
        hints: p.hints,
        resources: p.resources ?? [],
      })),
    ),
    resources: [
      ...new Map(
        run.profiles.flatMap((p) => p.resources ?? []).map((r) => [r.url, r]),
      ).values(),
    ].slice(0, 120),
    profiles: run.profiles.map((p) => ({
      profile: p.profile,
      status: p.status,
      httpStatus: p.http_status,
      blockedRequests: p.blocked,
    })),
    findings: [...findings.values()],
    limitations: [
      ...(truncated
        ? [
            "El informe limita los hallazgos a 80 entradas; se omitieron evidencias adicionales.",
          ]
        : []),
      "Revisión externa de la portada en dos perfiles emulados; no incluye páginas internas ni transacciones.",
      "Los perfiles son visitas distintas, no una confirmación de causa ni una prueba de que el error persiste en el tiempo.",
      "Recursos externos, redirecciones y acciones se restringen por seguridad; pueden alterar el comportamiento observado.",
      "La consola puede reflejar esas restricciones. Los bloqueos conocidos se excluyen de fallos HTTP y de conexión.",
      "Sin acceso a WordPress, PHP o registros internos no se confirman conflictos de plugins, malware ni causas de base de datos.",
      ...(limited
        ? [
            "Cobertura incompleta: existen perfiles fallidos, restricciones, datos ausentes o cierre de navegador no confirmado.",
          ]
        : []),
      "La ausencia de hallazgos no acredita que el sitio esté libre de fallos.",
    ],
  });
}

export function browserReportText(browser: BrowserAssessment): string {
  return [
    "Revisión del navegador",
    `Revisión en móvil y escritorio · ${browser.measuredAt}`,
    `Cobertura: ${browser.coverageLimited ? "limitada" : "portada, móvil y escritorio"}`,
    ...browser.profiles.map(
      (p) =>
        `${p.profile}: ${p.status}; HTTP ${p.httpStatus ?? "no medido"}; bloqueos del escáner: ${p.blockedRequests}.`,
    ),
    ...(browser.findings.length
      ? browser.findings.flatMap((f) => [
          `${f.title} [${f.profiles.join(", ")}] — ${f.assessment}`,
          `Recurso: ${f.url}`,
          `Evidencia: ${f.evidence}`,
          `Posible impacto: ${f.impact}`,
          `Siguiente comprobación: ${f.nextCheck}`,
        ])
      : [
          "No se registraron hallazgos dentro del alcance ejecutado. Esto no acredita ausencia de fallos.",
        ]),
    ...browser.limitations,
  ].join("\n");
}
