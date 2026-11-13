import { describe, it, expect } from "vitest";
import {
  resourceSignal,
  detectTechnologies,
  buildSiteEvidence,
} from "../packages/core/site-evidence";
import { assessBrowserRun } from "../packages/core/browser-report";
const page = "https://example.com/";
describe("Inventario externo y prioridad explicable", () => {
  it("agrupa perfiles y páginas sin desbordar evidencias de metadatos repetidos", () => {
    const resource = resourceSignal(
      page + "wp-content/plugins/elementor/frontend.js?ver=4.3.5",
      "script",
      200,
    );
    const pages = Array.from({ length: 8 }, (_, i) => ({
      url: page + i,
      generator: "Elementor 4.3.5",
      resources: [resource],
    }));
    const t = detectTechnologies(pages).find((t) => t.name === "Elementor")!;
    expect(t.pages).toHaveLength(8);
    expect(t.evidence.length).toBeLessThanOrEqual(3);
    expect(t.versionBasis).toBe("generator");
  });
  it("detecta componentes por recursos reales y separa versiones de archivos", () => {
    const resources = [
      resourceSignal(
        page +
          "wp-content/plugins/elementor/assets/js/frontend.min.js?ver=4.3.5",
        "script",
        200,
      ),
      resourceSignal(
        page + "wp-content/plugins/woocommerce/assets/css/layout.css",
        "stylesheet",
        200,
      ),
      resourceSignal("https://forms.zohopublic.com/embed.js", "script", 200),
      resourceSignal(
        page + "wp-includes/js/jquery/jquery.min.js?ver=3.5.1",
        "script",
        200,
      ),
    ];
    const detected = detectTechnologies([
      { url: page, generator: "WordPress 6.8", resources },
    ]);
    expect(detected.map((t) => t.name)).toEqual(
      expect.arrayContaining([
        "WordPress",
        "Elementor",
        "WooCommerce",
        "Zoho",
        "jQuery",
      ]),
    );
    expect(detected.find((t) => t.name === "Elementor")).toMatchObject({
      version: "4.3.5",
      versionBasis: "resource",
    });
    expect(detected.find((t) => t.name === "WordPress")).toMatchObject({
      version: "6.8",
      versionBasis: "generator",
    });
    expect(JSON.stringify(detected)).not.toContain("?ver=");
  });
  it("una librería incluida en un plugin no se presenta como su versión", () => {
    const r = resourceSignal(
      page +
        "wp-content/plugins/elementor/assets/lib/dialog/dialog.js?ver=4.9.3",
      "script",
      200,
    );
    expect(
      detectTechnologies([{ url: page, resources: [r] }]).find(
        (t) => t.name === "Elementor",
      )?.version,
    ).toBeNull();
  });
  it("un archivo fallido es una referencia, no una confirmación de plugin activo", () => {
    const r = resourceSignal(
      page + "wp-content/plugins/custom-plugin/frontend.js?token=private",
      "script",
      404,
    );
    const t = detectTechnologies([{ url: page, resources: [r] }]).find(
      (t) => t.kind === "plugin",
    )!;
    expect(t.loadedResources).toBe(0);
    expect(t.failedResources).toBe(1);
    expect(t.version).toBeNull();
    expect(JSON.stringify(t)).not.toContain("private");
  });
  it("no inventa Rank Math ni versiones por parecido de nombres", () => {
    expect(detectTechnologies([{ url: page, resources: [] }])).toEqual([]);
    const t = detectTechnologies([
      { url: page, resources: [], hints: ["rankmath"] },
    ]);
    expect(t[0]).toMatchObject({ name: "Rank Math SEO", version: null });
    expect(t[0]?.evidence[0]).toContain("Comentario HTML");
  });
  it("prioriza disponibilidad sin elevar una fuente 404 a crítica", () => {
    const profile = {
      profile: "desktop",
      status: "partial",
      reason: null,
      http_status: 500,
      blocked: 0,
      evidence: [
        { kind: "http", url: page, message: "http_response", status: 500 },
        {
          kind: "http",
          url: page + "font.woff2",
          message: "http_response",
          status: 404,
        },
      ],
    };
    const browser = assessBrowserRun(
      {
        target: page,
        policy_version: "test",
        measured_at: "2026-10-16T12:00:00.000Z",
        status: "partial",
        browser_closed: true,
        profiles: [profile],
      },
      page,
    );
    const site = buildSiteEvidence(
      { website: page, performanceScore: 42, metrics: [] },
      browser,
    );
    expect(site.findings.find((f) => f.id === "browser-0")?.severity).toBe(
      "critical",
    );
    expect(site.findings.find((f) => f.id === "browser-1")?.severity).toBe(
      "warning",
    );
    expect(site.findings.find((f) => f.id === "performance")).toMatchObject({
      severity: "warning",
      priority: "high",
    });
    const pcOnly = buildSiteEvidence(
      {
        website: page,
        performanceScore: 90,
        metrics: [],
        desktop: {
          performanceScore: 35,
          metrics: [
            { label: "Contenido principal (LCP)", value: 6300, unit: "ms" },
          ],
        },
      },
      browser,
    );
    const finding = pcOnly.findings.find((f) => f.id === "performance")!;
    expect(finding.title).toBe("Rendimiento PC deficiente");
    expect(finding.evidence).toContain(
      "PC · Contenido principal (LCP): 6300 ms",
    );
    expect(finding.summary).not.toContain("90/100");
  });
  it("asocia un recurso fallido al componente sin inventar una causa", () => {
    const url = page + "wp-content/plugins/contact-form-7/frontend.js";
    const browser = assessBrowserRun(
      {
        target: page,
        policy_version: "test",
        measured_at: "2026-10-16T12:00:00.000Z",
        status: "completed",
        browser_closed: true,
        profiles: [
          {
            profile: "desktop",
            status: "completed",
            reason: null,
            http_status: 200,
            blocked: 0,
            resources: [resourceSignal(url, "script", 404)],
            evidence: [
              { kind: "http", url, message: "http_response", status: 404 },
            ],
          },
        ],
      },
      page,
    );
    const site = buildSiteEvidence(
      { website: page, performanceScore: null, metrics: [] },
      browser,
    );
    expect(site.findings[0]?.technology).toBe("Contact Form 7");
    expect(site.findings[0]?.summary).toContain("no demuestra un conflicto");
  });
});
