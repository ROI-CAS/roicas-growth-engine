import { z } from "zod";
import { safeUrl } from "../runner/policy";
import type { BrowserAssessment } from "./browser-report";
import { escapeHtml as e } from "./http";

export const resourceSchema = z.object({
  url: z.string().max(300).transform(safeUrl),
  type: z.enum(["script", "stylesheet", "font", "image", "document", "other"]),
  status: z.number().int().min(100).max(599).nullable(),
  versionHint: z
    .string()
    .max(50)
    .regex(/^\d+\.\d+(?:\.\d+){0,2}(?:[-+][a-z0-9.-]+)?$/i)
    .nullable(),
  bytes: z.number().nonnegative().nullable().optional(),
  durationMs: z.number().nonnegative().nullable().optional(),
});
export type ResourceSignal = z.infer<typeof resourceSchema>;
export function resourceSignal(
  raw: string,
  type: string,
  status: number | null,
  bytes?: number,
  durationMs?: number,
): ResourceSignal {
  const ver = new URL(raw).searchParams.get("ver");
  return resourceSchema.parse({
    url: safeUrl(raw),
    type: ["script", "stylesheet", "font", "image", "document"].includes(type)
      ? type
      : "other",
    status,
    versionHint:
      ver && /^\d+\.\d+(?:\.\d+){0,2}(?:[-+][a-z0-9.-]+)?$/i.test(ver)
        ? ver
        : null,
    bytes: bytes && Number.isFinite(bytes) ? bytes : null,
    durationMs: durationMs && Number.isFinite(durationMs) ? durationMs : null,
  });
}
export const technologySchema = z.object({
  id: z.string().max(100),
  name: z.string().max(100),
  category: z.string().max(80),
  kind: z.enum(["plugin", "cms", "library", "service"]),
  version: z.string().max(50).nullable(),
  versionBasis: z.enum(["generator", "resource", "not_exposed"]),
  evidence: z.array(z.string().max(300)).max(3),
  pages: z.array(z.string().max(300)).max(12),
  loadedResources: z.number().int().nonnegative(),
  failedResources: z.number().int().nonnegative(),
});
export type Technology = z.infer<typeof technologySchema>;
const plugins: Record<string, [string, string]> = {
  "piotnet-addons-for-elementor-pro": [
    "Piotnet Addons Pro",
    "Extensiones de Elementor",
  ],
  "simple-google-recaptcha": [
    "Simple Google reCAPTCHA",
    "Protección de formularios",
  ],
  "download-monitor": ["Download Monitor", "Descargas"],
  "bluehost-wordpress-plugin": ["Bluehost", "Hosting y rendimiento"],
  megamenu: ["Max Mega Menu", "Navegación"],
  "jet-elements": ["JetElements", "Extensiones de Elementor"],
  "country-code-field-for-elementor-form": [
    "Country Code Field",
    "Formularios Elementor",
  ],
  elementor: ["Elementor", "Constructor visual"],
  "elementor-pro": ["Elementor Pro", "Constructor visual"],
  revslider: ["Slider Revolution", "Sliders y elementos visuales"],
  woocommerce: ["WooCommerce", "Comercio electrónico"],
  "seo-by-rank-math": ["Rank Math SEO", "SEO"],
  "wordpress-seo": ["Yoast SEO", "SEO"],
  "contact-form-7": ["Contact Form 7", "Formularios"],
  "wpforms-lite": ["WPForms Lite", "Formularios"],
  "elementskit-lite": ["ElementsKit Lite", "Extensiones de Elementor"],
  elementskit: ["ElementsKit", "Extensiones de Elementor"],
  "premium-addons-for-elementor": [
    "Premium Addons for Elementor",
    "Extensiones de Elementor",
  ],
  pixelyoursite: ["PixelYourSite", "Seguimiento"],
  "wp-rocket": ["WP Rocket", "Caché y optimización"],
  "litespeed-cache": ["LiteSpeed Cache", "Caché y optimización"],
  "cookie-law-info": ["CookieYes", "Consentimiento"],
};
const services: [RegExp, string, string, string][] = [
  [
    /\.(?:zoho|zohopublic)\.com$|^(?:zoho|zohopublic)\.com$/,
    "zoho",
    "Zoho",
    "CRM y formularios",
  ],
  [
    /(^|\.)googletagmanager\.com$/,
    "gtm",
    "Google Tag Manager / etiquetas Google",
    "Etiquetas",
  ],
  [/(^|\.)google-analytics\.com$/, "ga", "Google Analytics", "Analítica"],
  [/(^|\.)clarity\.ms$/, "clarity", "Microsoft Clarity", "Analítica"],
  [/(^|\.)facebook\.net$/, "meta", "Meta Pixel", "Publicidad"],
  [/(^|\.)ads\.linkedin\.com$/, "linkedin", "LinkedIn Insight", "Publicidad"],
  [/(^|\.)tiktok\.com$/, "tiktok", "TikTok Pixel", "Publicidad"],
  [/(^|\.)cariai\.com$/, "cariai", "CarIAI", "Chat"],
  [/(^|\.)vexo\.co$/, "vexo", "Vexo", "Analítica"],
];
export function detectTechnologies(
  pages: {
    url: string;
    generator?: string;
    resources: ResourceSignal[];
    hints?: string[];
  }[],
): Technology[] {
  const found = new Map<string, Technology>();
  function add(
    id: string,
    name: string,
    category: string,
    kind: Technology["kind"],
    page: string,
    resource: ResourceSignal | null,
    version: string | null = null,
    basis: Technology["versionBasis"] = "not_exposed",
  ) {
    let t = found.get(id);
    if (!t) {
      t = {
        id,
        name,
        category,
        kind,
        version,
        versionBasis: basis,
        evidence: [],
        pages: [],
        loadedResources: 0,
        failedResources: 0,
      };
      found.set(id, t);
    }
    if (basis === "generator" && version) {
      t.version = version;
      t.versionBasis = "generator";
    }
    if (!t.pages.includes(page) && t.pages.length < 12) t.pages.push(page);
    if (resource) {
      if (!t.evidence.includes(resource.url) && t.evidence.length < 3)
        t.evidence.push(resource.url);
      if ((resource.status ?? 0) >= 200 && (resource.status ?? 0) < 300)
        t.loadedResources++;
      if ((resource.status ?? 0) >= 400) t.failedResources++;
      if (
        kind !== "cms" &&
        !t.version &&
        resource.versionHint &&
        !(kind === "plugin" && /\/(?:lib|libs|vendor)\//.test(resource.url))
      ) {
        t.version = resource.versionHint;
        t.versionBasis = "resource";
      }
    }
  }
  for (const page of pages) {
    const declared: [string, string, string, string][] = [
      ["plugin:elementor", "Elementor", "Constructor visual", "Elementor"],
      [
        "plugin:revslider",
        "Slider Revolution",
        "Sliders y elementos visuales",
        "Slider\\s*Revolution",
      ],
    ];
    for (const [id, name, category, pattern] of declared) {
      const match = page.generator?.match(
        new RegExp(pattern + "\\s+(\\d+\\.\\d+(?:\\.\\d+)?)", "i"),
      );
      if (match) {
        add(
          id,
          name,
          category,
          "plugin",
          page.url,
          null,
          match[1]!,
          "generator",
        );
        const t = found.get(id)!;
        const evidence = "Meta generator: " + name + " " + match[1];
        if (!t.evidence.includes(evidence) && t.evidence.length < 3)
          t.evidence.push(evidence);
      }
    }
    if (page.hints?.includes("rankmath")) {
      add(
        "plugin:seo-by-rank-math",
        "Rank Math SEO",
        "SEO",
        "plugin",
        page.url,
        null,
      );
      const t = found.get("plugin:seo-by-rank-math")!;
      if (!t.evidence.length) t.evidence.push("Comentario HTML: Rank Math SEO");
    }
    const wp = page.generator?.match(/WordPress\s+(\d+\.\d+(?:\.\d+)?)/i);
    if (wp)
      add(
        "wordpress",
        "WordPress",
        "Gestor de contenido",
        "cms",
        page.url,
        null,
        wp[1]!,
        "generator",
      );
    for (const r of page.resources) {
      let u: URL;
      try {
        u = new URL(r.url);
      } catch {
        continue;
      }
      if (/\/wp-(?:content|includes)\//.test(u.pathname))
        add(
          "wordpress",
          "WordPress",
          "Gestor de contenido",
          "cms",
          page.url,
          r,
        );
      if (u.pathname.startsWith("/wp-includes/")) {
        const wp = found.get("wordpress");
        if (wp && !wp.evidence.some((e) => e.includes("/wp-includes/")))
          wp.evidence = [r.url, ...wp.evidence].slice(0, 3);
      }
      const slug = u.pathname
        .match(/\/wp-content\/plugins\/([a-z0-9_-]+)\//i)?.[1]
        ?.toLowerCase();
      if (slug) {
        const known = plugins[slug];
        add(
          "plugin:" + slug,
          known?.[0] ?? slug,
          known?.[1] ?? "Plugin (ruta pública)",
          "plugin",
          page.url,
          r,
        );
      }
      if (/\/jquery(?:\.min)?\.js$/.test(u.pathname))
        add(
          "jquery",
          "jQuery",
          "Biblioteca JavaScript",
          "library",
          page.url,
          r,
        );
      if (/jquery-migrate(?:\.min)?\.js$/.test(u.pathname))
        add(
          "jquery-migrate",
          "jQuery Migrate",
          "Biblioteca JavaScript",
          "library",
          page.url,
          r,
        );
      for (const [test, id, name, category] of services)
        if (test.test(u.hostname))
          add(id, name, category, "service", page.url, r);
    }
  }
  return [...found.values()].slice(0, 50).map((t) => technologySchema.parse(t));
}

export const siteEvidenceSchema = z.object({
  pages: z
    .array(
      z.object({
        url: z.string().max(300),
        title: z.string().max(180),
        status: z.number().int().min(100).max(599).nullable(),
        measuredAt: z.iso.datetime(),
        method: z.enum(["browser", "http"]),
        resourceCount: z.number().int().nonnegative(),
      }),
    )
    .max(12),
  technologies: z.array(technologySchema).max(50),
  resources: z.array(resourceSchema).max(120),
  findings: z
    .array(
      z.object({
        id: z.string().max(100),
        title: z.string().max(160),
        severity: z.enum(["critical", "warning", "info"]),
        priority: z.enum(["high", "medium", "low"]),
        summary: z.string().max(500),
        evidence: z.array(z.string().max(500)).max(5),
        impact: z.string().max(500),
        recommendation: z.string().max(600),
        pages: z.array(z.string().max(300)).max(12),
        technology: z.string().max(100).nullable(),
        verification: z.enum(["observed", "probable", "unverified"]),
      }),
    )
    .max(80),
  limitations: z.array(z.string().max(500)).max(12),
});
export type SiteEvidence = z.infer<typeof siteEvidenceSchema>;
export function siteEvidenceHtml(site: SiteEvidence): string {
  const severity = {
    critical: "Crítico",
    warning: "Advertencia",
    info: "Informativo",
  };
  return `<section><h2>${site.pages.length} páginas examinadas · ${site.findings.length} hallazgos</h2>${site.findings.map((f) => `<article><h3>${e(f.title)} · ${severity[f.severity]}</h3><p>Prioridad: ${{ high: "Alta", medium: "Media", low: "Baja" }[f.priority]}</p><p>${e(f.summary)}</p><ul>${f.evidence.map((x) => `<li><code>${e(x)}</code></li>`).join("")}</ul><p>Posible impacto: ${e(f.impact)}</p><p>Siguiente paso: ${e(f.recommendation)}</p></article>`).join("")}<h2>Tecnologías detectadas</h2>${site.technologies.map((t) => `<details><summary>${e(t.name)} · ${e(t.category)}${t.version ? " · versión expuesta " + e(t.version) : ""}</summary><p>${t.versionBasis === "resource" ? "El número procede de un archivo público; no confirma la versión interna del plugin." : "La versión interna requiere comprobación autorizada."}</p><ul>${t.evidence.map((v) => `<li><code>${e(v)}</code></li>`).join("")}</ul><p>Respuestas correctas registradas: ${t.loadedResources}. Respuestas de error: ${t.failedResources}.</p></details>`).join("")}<h2>Recursos registrados</h2><ul>${site.resources.map((r) => `<li>${e(r.type)} · HTTP ${r.status ?? "no registrado"} · <code>${e(r.url)}</code></li>`).join("")}</ul><h2>Páginas examinadas</h2><ul>${site.pages.map((p) => `<li>${e(p.url)} · HTTP ${p.status ?? "no registrado"} · ${p.method === "browser" ? "Navegador" : "HTTP/HTML"}</li>`).join("")}</ul></section>`;
}
export function buildSiteEvidence(
  report: {
    website: string;
    performanceScore: number | null;
    metrics: { label: string; value: number | null; unit: string }[];
    desktop?: {
      performanceScore: number | null;
      metrics: { label: string; value: number | null; unit: string }[];
    };
  },
  browser: BrowserAssessment,
): SiteEvidence {
  const technologies = browser.technologies ?? [];
  const findings: SiteEvidence["findings"] = browser.findings.map((f, i) => {
    const status = Number(f.evidence.match(/^HTTP (\d+)/)?.[1]);
    const unavailable =
      f.category === "http" && status >= 500 && f.url === report.website;
    const plugin = f.url.match(/\/wp-content\/plugins\/([^/]+)\//)?.[1];
    const technology = plugin
      ? (technologies.find((t) => t.id === "plugin:" + plugin)?.name ?? null)
      : null;
    const uncertain =
      browser.coverageLimited &&
      (f.category === "transport" ||
        (f.category === "console" && /network|net::/i.test(f.evidence)));
    return {
      id: "browser-" + i,
      title: f.title,
      severity: unavailable ? "critical" : uncertain ? "info" : "warning",
      priority:
        unavailable || f.category === "javascript"
          ? "high"
          : f.category === "http"
            ? "medium"
            : "low",
      summary: technology
        ? `Se observó un error en un recurso público asociado a ${technology}. La asociación no demuestra un conflicto interno.`
        : f.impact,
      evidence: [f.url, f.evidence],
      impact: f.impact,
      recommendation: f.nextCheck,
      pages: [report.website],
      technology,
      verification: uncertain ? "unverified" : "observed",
    };
  });
  const poorProfiles = [
    { name: "móvil", data: report },
    ...(report.desktop ? [{ name: "PC", data: report.desktop }] : []),
  ].filter(
    (p) => p.data.performanceScore !== null && p.data.performanceScore < 50,
  );
  if (poorProfiles.length)
    findings.unshift({
      id: "performance",
      title: `Rendimiento ${poorProfiles.map((p) => p.name).join(" y ")} deficiente`,
      severity: "warning",
      priority: "high",
      summary: `Las pruebas de laboratorio obtuvieron ${poorProfiles.map((p) => `${p.name}: ${p.data.performanceScore}/100`).join("; ")}. La presentación del contenido requiere revisión.`,
      evidence: poorProfiles
        .flatMap((p) => [
          `Google PageSpeed Insights (${p.name}): ${p.data.performanceScore}/100`,
          ...p.data.metrics
            .filter((m) => m.label.includes("LCP") && m.value !== null)
            .map((m) => `${p.name} · ${m.label}: ${m.value!.toFixed(0)} ms`),
        ])
        .slice(0, 5),
      impact:
        "El contenido principal puede tardar en presentarse en condiciones similares a las de la prueba.",
      recommendation:
        "Revisar el elemento LCP y la carga inicial de scripts, imágenes y fuentes. Medir otra vez después de cada cambio, sin atribuir la lentitud a un plugin por su sola presencia.",
      pages: [report.website],
      technology: null,
      verification: "observed",
    });
  if (technologies.length)
    findings.push({
      id: "inventory",
      title: "Tecnologías detectadas en la carga",
      severity: "info",
      priority: "low",
      summary: `Se observaron ${technologies.length} tecnologías mediante recursos públicos y señales de la página.`,
      evidence: technologies.slice(0, 5).map((t) => t.name),
      impact:
        "Permite orientar la revisión hacia los componentes realmente observados.",
      recommendation:
        "Confirmar versiones y activación dentro de WordPress antes de afirmar desactualización, vulnerabilidad o conflicto.",
      pages: [report.website],
      technology: null,
      verification: "observed",
    });
  return siteEvidenceSchema.parse({
    pages: [
      {
        url: report.website,
        title: new URL(report.website).hostname,
        status: browser.profiles[0]?.httpStatus ?? null,
        measuredAt: browser.measuredAt,
        method: "browser",
        resourceCount: browser.resources?.length ?? 0,
      },
    ],
    technologies,
    resources: browser.resources ?? [],
    findings: findings.slice(0, 80),
    limitations: [
      "Inventario externo de recursos observados; no equivale al listado completo de plugins instalados o activos.",
      "Las versiones en parámetros de archivos son indicios y pueden pertenecer al recurso o a su caché; no se confirman versiones internas.",
      "Una tecnología detectada no se considera defectuosa por su sola presencia.",
    ],
  });
}
