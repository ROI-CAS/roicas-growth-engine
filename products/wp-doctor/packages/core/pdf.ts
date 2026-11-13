import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFPage,
  type PDFFont,
  type RGB,
} from "pdf-lib";
import type { DiagnosisReport } from "./diagnosis";
import { ROICAS_LOGO_PNG, ROICAS_ICON_PNG } from "./brand-assets";

export async function diagnosisPdf(
  report: DiagnosisReport,
  demo = false,
): Promise<Uint8Array<ArrayBuffer>> {
  const pdf = await PDFDocument.create();
  const logo = await pdf.embedPng(ROICAS_LOGO_PNG),
    icon = await pdf.embedPng(ROICAS_ICON_PNG);
  const regular = await pdf.embedFont(StandardFonts.Helvetica),
    bold = await pdf.embedFont(StandardFonts.HelveticaBold),
    mono = await pdf.embedFont(StandardFonts.Courier);
  const c = {
    red: rgb(1, 0.36, 0.16),
    ink: rgb(0.15, 0.17, 0.2),
    muted: rgb(0.37, 0.41, 0.48),
    line: rgb(0.88, 0.9, 0.93),
    wash: rgb(0.96, 0.97, 0.98),
    white: rgb(1, 1, 1),
    green: rgb(0.06, 0.43, 0.31),
    amber: rgb(0.65, 0.36, 0.05),
    rose: rgb(1, 0.96, 0.93),
  };
  const x = 38,
    width = 519;
  let page: PDFPage,
    y = 0;
  const clean = (s: string) =>
    s.normalize("NFC").replace(/[^\x20-\x7e\xa0-\xff]/g, "-");
  const date = (s: string) =>
    new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Bogota",
    }).format(new Date(s));
  const host = new URL(report.website).hostname;
  function draw(
    value: string,
    px: number,
    py: number,
    size = 10,
    font = regular,
    color = c.ink,
  ) {
    page.drawText(clean(value), { x: px, y: py, size, font, color });
  }
  function lines(
    value: string,
    maxWidth: number,
    size = 10,
    font: PDFFont = regular,
  ): string[] {
    const out: string[] = [];
    let line = "";
    for (const word of clean(value).split(/\s+/)) {
      let part = "";
      for (const ch of word) {
        if (font.widthOfTextAtSize(part + ch, size) > maxWidth) {
          if (line) {
            out.push(line);
            line = "";
          }
          out.push(part);
          part = "";
        }
        part += ch;
      }
      if (line && font.widthOfTextAtSize(line + " " + part, size) > maxWidth) {
        out.push(line);
        line = "";
      }
      line += (line ? " " : "") + part;
    }
    if (line) out.push(line);
    return out.length ? out : [""];
  }
  function rect(px: number, py: number, w: number, h: number, color: RGB) {
    page.drawRectangle({ x: px, y: py, width: w, height: h, color });
  }
  function newPage(section: string) {
    page = pdf.addPage([595, 842]);
    rect(0, 840, 595, 2, c.red);
    page.drawImage(icon, { x, y: 782, width: 30, height: 30 });
    draw("WP Doctor", x + 40, 797, 21, bold);
    draw(
      demo
        ? "EJEMPLO ILUSTRATIVO · DATOS SIMULADOS"
        : "Diagnóstico externo de WordPress",
      x + 40,
      781,
      8,
      regular,
      c.muted,
    );
    draw("Un producto de", 448, 820, 7, regular, c.muted);
    page.drawImage(logo, { x: 438, y: 780, width: 119, height: 39.67 });
    rect(x, 769, width, 1, c.line);
    y = 741;
    if (section) {
      draw(section, x, y, 19, bold);
      y -= 32;
    }
  }
  function ensure(h: number, section = "Continuación del diagnóstico") {
    if (y - h < 65) newPage(section);
  }
  function paragraph(value: string, size = 10, color = c.muted, indent = 0) {
    const rows = lines(value, width - indent, size);
    if (rows.length * size * 1.5 < 640) ensure(rows.length * size * 1.5);
    for (const line of rows) {
      ensure(size * 1.5);
      draw(line, x + indent, y, size, regular, color);
      y -= size * 1.5;
    }
  }
  function heading(value: string) {
    ensure(58);
    y -= 14;
    draw(value, x, y, 16, bold);
    y -= 27;
  }
  function box(px: number, py: number, w: number, h: number, fill = c.white) {
    page.drawRectangle({
      x: px,
      y: py,
      width: w,
      height: h,
      color: fill,
      borderColor: c.line,
      borderWidth: 0.65,
    });
  }
  function table(
    headers: string[],
    widths: number[],
    rows: string[][],
    section: string,
  ) {
    function header() {
      box(x, y - 25, width, 25, c.wash);
      let left = x;
      headers.forEach((label, i) => {
        draw(label, left + 9, y - 16, 7, bold, c.muted);
        left += widths[i]!;
      });
      y -= 25;
    }
    ensure(75, section);
    header();
    for (const row of rows) {
      const cells = row.map((text, i) => lines(text, widths[i]! - 18, 8.5));
      const h = Math.max(32, ...cells.map((cell) => cell.length * 12 + 17));
      if (y - h < 65) {
        newPage(section);
        header();
      }
      box(x, y - h, width, h);
      let left = x;
      cells.forEach((cell, i) => {
        cell.forEach((text, j) => draw(text, left + 9, y - 17 - j * 12, 8.5));
        left += widths[i]!;
      });
      y -= h;
    }
    y -= 16;
  }
  const scoreColor = (score: number | null | undefined) =>
    score == null
      ? c.muted
      : score >= 90
        ? c.green
        : score >= 50
          ? c.amber
          : rgb(0.84, 0.19, 0.25);
  const scoreText = (score: number | null | undefined) =>
    score == null ? "No medido" : String(score);
  const metricText = (m: { value: number | null; unit: string } | undefined) =>
    !m || m.value === null
      ? "No medido"
      : m.unit === "ms"
        ? m.value >= 1000
          ? `${(m.value / 1000).toFixed(2).replace(".", ",")} s`
          : `${Math.round(m.value)} ms`
        : m.value.toFixed(3).replace(".", ",");
  const browser = report.browser,
    site = report.site;
  const findings = site
    ? site.findings.map((f) => ({
        title: f.title,
        evidence: f.evidence
          .map((e) => e.slice(0, 300))
          .slice(0, 3)
          .join(" · "),
        url:
          (f.pages.length > 1 ? `${f.pages.length} páginas. Ejemplo: ` : "") +
          (f.pages[0] ?? report.website),
        impact: f.impact,
        nextCheck: f.recommendation,
        profiles: [] as ("desktop" | "mobile")[],
      }))
    : (browser?.findings ?? []);
  const counts = {
    critical:
      site?.findings.filter((f) => f.severity === "critical").length ?? 0,
    warning:
      site?.findings.filter((f) => f.severity === "warning").length ??
      findings.length,
    info: site?.findings.filter((f) => f.severity === "info").length ?? 0,
  };
  pdf.setTitle(`Diagnóstico de WordPress | ${host} | WP Doctor`);
  pdf.setAuthor("Roicas · WP Doctor");
  pdf.setCreationDate(new Date(report.measuredAt));
  pdf.setModificationDate(new Date(browser?.measuredAt ?? report.measuredAt));
  newPage("");
  draw(date(report.measuredAt) + " · Colombia", x, 747, 8, regular, c.muted);
  box(x, 687, width, 40);
  draw(host, x + 12, 702, 13, bold, c.red);
  const kpis = [
    {
      label: "RENDIMIENTO MÓVIL",
      value:
        report.strategy === "mobile"
          ? scoreText(report.performanceScore)
          : "No medido",
      color:
        report.strategy === "mobile"
          ? scoreColor(report.performanceScore)
          : c.muted,
    },
    {
      label: "RENDIMIENTO PC",
      value: scoreText(
        report.desktop?.performanceScore ??
          (report.strategy === "desktop" ? report.performanceScore : null),
      ),
      color: scoreColor(
        report.desktop?.performanceScore ??
          (report.strategy === "desktop" ? report.performanceScore : null),
      ),
    },
    {
      label: "CRÍTICOS OBSERVADOS",
      value: String(counts.critical),
      color: counts.critical ? rgb(0.84, 0.19, 0.25) : c.ink,
    },
    {
      label: "ADVERTENCIAS",
      value: String(counts.warning),
      color: counts.warning ? c.amber : c.ink,
    },
  ];
  kpis.forEach((kpi, i) => {
    const left = x + (i * width) / 4;
    box(left, 603, width / 4, 70);
    draw(kpi.label, left + 10, 655, 6.6, bold, c.muted);
    draw(
      kpi.value,
      left + 10,
      627,
      kpi.value === "No medido" ? 14 : 25,
      bold,
      kpi.color,
    );
    if (i < 2) draw("Laboratorio / 100", left + 10, 613, 7, regular, c.muted);
  });
  y = 581;
  paragraph(
    `Examinamos ${site?.pages.length ?? 1} página(s) y registramos ${findings.length} hallazgos dentro del alcance disponible. La velocidad y los errores técnicos se muestran por separado; no constituyen una puntuación global de salud.`,
    9,
    c.ink,
  );
  y -= 6;
  const panelTop = y,
    panelWidth = (width - 14) / 2;
  box(x, panelTop - 140, panelWidth, 140);
  box(x + panelWidth + 14, panelTop - 140, panelWidth, 140);
  draw("COBERTURA DE LA REVISIÓN", x + 12, panelTop - 20, 7, bold, c.muted);
  draw(String(site?.pages.length ?? 1), x + 12, panelTop - 48, 23, bold);
  draw("página(s) examinada(s)", x + 45, panelTop - 46, 8, regular, c.muted);
  const pages = site?.pages ?? [
    { status: browser?.profiles[0]?.httpStatus ?? null },
  ];
  const summaryRows = [
    [
      "Respuestas HTTP 2xx",
      String(
        pages.filter(
          (p) => p.status !== null && p.status >= 200 && p.status < 300,
        ).length,
      ),
      c.green,
    ],
    [
      "Respuestas HTTP 4xx / 5xx",
      String(pages.filter((p) => (p.status ?? 0) >= 400).length),
      rgb(0.84, 0.19, 0.25),
    ],
    [
      "Recursos registrados",
      String(site?.resources.length ?? browser?.resources?.length ?? 0),
      c.muted,
    ],
    [
      "Tecnologías identificadas",
      String(site?.technologies.length ?? browser?.technologies?.length ?? 0),
      c.muted,
    ],
  ] as const;
  summaryRows.forEach(([label, value, color], i) => {
    const row = panelTop - 72 - i * 16;
    rect(x + 12, row - 1, 5, 5, color);
    draw(label, x + 24, row, 7.7);
    draw(value, x + panelWidth - 23, row, 8, bold);
  });
  const right = x + panelWidth + 14;
  draw("PRINCIPALES HALLAZGOS", right + 12, panelTop - 20, 7, bold, c.muted);
  draw(String(findings.length), right + 12, panelTop - 48, 23, bold);
  const ordered = [...findings];
  if (!ordered.length)
    lines(
      browser
        ? "Sin hallazgos registrados. La ausencia de alertas no acredita que todo funcione."
        : "Análisis del navegador no ejecutado. Solo se dispone de rendimiento.",
      panelWidth - 24,
      8,
    )
      .slice(0, 4)
      .forEach((line, i) =>
        draw(line, right + 12, panelTop - 72 - i * 12, 8, regular, c.muted),
      );
  ordered.slice(0, 3).forEach((f, i) => {
    draw(String(i + 1), right + 12, panelTop - 72 - i * 22, 8, bold, c.red);
    lines(f.title, panelWidth - 40, 8)
      .slice(0, 2)
      .forEach((line, j) =>
        draw(line, right + 27, panelTop - 72 - i * 22 - j * 10, 8),
      );
  });
  y = panelTop - 158;
  heading("Velocidad y experiencia de carga");
  paragraph(
    "Mediciones de laboratorio independientes por dispositivo. No representan el historial de tus visitantes ni prueban formularios, compras o pagos.",
    8.5,
  );
  const quickProfiles = [
    { name: report.strategy === "desktop" ? "PC" : "MÓVIL", data: report },
    ...(report.desktop ? [{ name: "PC", data: report.desktop }] : []),
  ];
  const metrics = [
    {
      key: "LCP",
      label: "CONTENIDO PRINCIPAL",
      good: 2500,
      poor: 4000,
      note: "LCP · menor es mejor",
    },
    {
      key: "Bloqueo",
      label: "BLOQUEO DEL NAVEGADOR",
      good: 200,
      poor: 600,
      note: "TBT · no equivale a INP",
    },
    {
      key: "CLS",
      label: "ESTABILIDAD VISUAL",
      good: 0.1,
      poor: 0.25,
      note: "CLS · menor es mejor",
    },
  ];
  const cardWidth = (width - 16) / 3,
    summaryCardTop = y;
  metrics.forEach((metric, i) => {
    const left = x + i * (cardWidth + 8);
    box(left, summaryCardTop - 125, cardWidth, 125);
    draw(metric.label, left + 8, summaryCardTop - 17, 6.3, bold, c.muted);
    draw(metric.note, left + 8, summaryCardTop - 29, 6.4, regular, c.muted);
    quickProfiles.forEach((profile, j) => {
      const m = profile.data.metrics.find((m) => m.label.includes(metric.key));
      const py = summaryCardTop - 49 - j * 36;
      draw(profile.name, left + 8, py, 6.4, bold, c.muted);
      draw(
        metricText(m),
        left + 43,
        py,
        10.5,
        bold,
        m?.value == null
          ? c.muted
          : m.value <= metric.good
            ? c.green
            : m.value <= metric.poor
              ? c.amber
              : rgb(0.84, 0.19, 0.25),
      );
      const track = cardWidth - 16;
      rect(left + 8, py - 13, track / 3, 4, rgb(0.51, 0.87, 0.72));
      rect(left + 8 + track / 3, py - 13, track / 3, 4, rgb(1, 0.8, 0.4));
      rect(
        left + 8 + (2 * track) / 3,
        py - 13,
        track / 3,
        4,
        rgb(1, 0.59, 0.64),
      );
      if (m?.value != null) {
        const ratio =
          m.value <= metric.good
            ? m.value / metric.good / 3
            : m.value <= metric.poor
              ? 1 / 3 +
                (m.value - metric.good) / (metric.poor - metric.good) / 3
              : 2 / 3 + Math.min(1, (m.value - metric.poor) / metric.poor) / 3;
        rect(
          left + 8 + Math.min(track - 2, Math.max(0, ratio * track)),
          py - 16,
          2,
          10,
          c.ink,
        );
      }
    });
  });
  y = summaryCardTop - 144;
  paragraph(
    "Verde: referencia favorable · Ámbar: requiere mejora · Rojo: fuera de la referencia. Los datos ausentes se muestran como «No medido».",
    7.5,
  );
  if (browser) {
    newPage("01 / Hallazgos y evidencia");
    paragraph(
      `Revisión en móvil y escritorio · ${date(browser.measuredAt)} (Colombia)`,
      9,
    );
    paragraph(
      browser.coverageLimited
        ? "Cobertura limitada: las restricciones o fallos de ejecución pueden alterar lo observado."
        : "Alcance: carga inicial de la portada en móvil y escritorio emulados.",
      10,
    );
    y -= 12;
    for (const p of browser.profiles) {
      ensure(30);
      rect(x, y - 13, width, 26, c.wash);
      draw(
        p.profile === "mobile" ? "MÓVIL" : "ESCRITORIO",
        x + 12,
        y - 3,
        8,
        bold,
      );
      draw(
        `HTTP ${p.httpStatus ?? "no medido"}  |  ${p.status === "completed" ? "Revisión completada" : p.status === "partial" ? "Revisión limitada" : "No completada"}`,
        x + 130,
        y - 3,
        8.5,
        regular,
        c.muted,
      );
      y -= 33;
    }
    y -= 12;
    if (!ordered.length)
      paragraph(
        "No se registraron errores dentro de esta ejecución. La ausencia de registros no equivale a una certificación de funcionamiento.",
        11,
      );
    if (ordered.length)
      table(
        ["HALLAZGO", "PRIORIDAD", "CLASIFICACIÓN"],
        [325, 84, 110],
        ordered.map((f, i) => [
          f.title,
          site
            ? { high: "Alta", medium: "Media", low: "Baja" }[
                site.findings[i]!.priority
              ]
            : "Por revisar",
          site
            ? {
                critical: "Crítico",
                warning: "Advertencia",
                info: "Informativo",
              }[site.findings[i]!.severity]
            : "Observado",
        ]),
        "01 / Hallazgos · índice",
      );
    for (const [i, f] of ordered.entries()) {
      const blocks = [
        ...(site?.findings[i]?.technology
          ? [
              {
                label: "COMPONENTE ASOCIADO",
                value: site.findings[i]!.technology!,
                font: regular,
                size: 9.5,
              },
            ]
          : []),
        { label: "RECURSO OBSERVADO", value: f.url, font: mono, size: 8.5 },
        { label: "EVIDENCIA", value: f.evidence, font: mono, size: 9 },
        { label: "POSIBLE IMPACTO", value: f.impact, font: regular, size: 9.5 },
        {
          label: "SIGUIENTE COMPROBACIÓN",
          value: f.nextCheck,
          font: regular,
          size: 9.5,
        },
      ].map((b) => ({
        ...b,
        rows: lines(b.value, width - 32, b.size, b.font),
      }));
      const titleRows = lines(
        `${String(i + 1).padStart(2, "0")}  ${f.title}`,
        width - 32,
        11,
        bold,
      );
      const extraTitle = (titleRows.length - 1) * 15;
      const h =
        57 +
        extraTitle +
        blocks.reduce((n, b) => n + 19 + b.rows.length * b.size * 1.4, 0);
      ensure(h + 14, "01 / Evidencias · continuación");
      const top = y;
      rect(x, top - h, width, h, c.wash);
      rect(x, top - h, 3, h, c.red);
      titleRows.forEach((line, row) =>
        draw(line, x + 16, y - 20 - row * 15, 11, bold),
      );
      y -= extraTitle;
      draw(
        site
          ? `${{ critical: "CRÍTICO", warning: "ADVERTENCIA", info: "INFORMATIVO" }[site.findings[i]!.severity]}  /  PRIORIDAD ${{ high: "ALTA", medium: "MEDIA", low: "BAJA" }[site.findings[i]!.priority]}  /  ${site.findings[i]!.verification === "observed" ? "OBSERVADO" : "POR VERIFICAR"}`
          : `OBSERVADO  /  ${f.profiles.map((p) => (p === "mobile" ? "móvil" : "escritorio")).join(" + ")}`,
        x + 16,
        y - 36,
        8,
        bold,
        site?.findings[i]?.severity === "warning"
          ? c.amber
          : site?.findings[i]?.severity === "info"
            ? c.ink
            : c.red,
      );
      y -= 51;
      for (const b of blocks) {
        draw(b.label, x + 16, y, 7, bold, c.muted);
        y -= 14;
        for (const row of b.rows) {
          draw(row, x + 16, y, b.size, b.font);
          y -= b.size * 1.4;
        }
        y -= 5;
      }
      y = top - h - 18;
    }
  }
  if (site) {
    if (site.technologies.length)
      newPage("02 / Tecnologías y plugins detectados");
    else heading("Tecnologías y plugins detectados");
    paragraph(
      "Inventario de señales públicas. Detectar un componente no demuestra que esté defectuoso, actualizado ni activo en todo el sitio.",
      10,
    );
    y -= 14;
    const techs = [...site.technologies].sort(
      (a, b) =>
        ({ cms: 0, plugin: 1, library: 2, service: 3 })[a.kind] -
        { cms: 0, plugin: 1, library: 2, service: 3 }[b.kind],
    );
    if (techs.length)
      table(
        ["TECNOLOGÍA / CATEGORÍA", "VERSIÓN EXPUESTA", "SEÑAL PÚBLICA"],
        [220, 120, 179],
        techs.map((t) => [
          `${t.name} · ${t.category}`,
          t.version
            ? `${t.version} (${t.versionBasis === "generator" ? "HTML" : "archivo"}; sin validar)`
            : "No confirmada",
          t.failedResources
            ? `${t.failedResources} recurso(s) con fallo`
            : t.loadedResources
              ? `${t.loadedResources} respuesta(s) 2xx`
              : "Referencia en HTML",
        ]),
        "02 / Tecnologías · continuación",
      );
    else
      paragraph(
        "No se identificaron señales suficientes para elaborar un inventario fiable.",
      );
    if (site.technologies.length) newPage("03 / Lo que carga la web");
    else heading("Lo que carga la web");
    paragraph(
      "Muestra de archivos registrados: estado HTTP y recurso concreto. HTTP 200 confirma una respuesta, no que todas sus funciones estén correctas.",
      10,
    );
    y -= 14;
    table(
      ["RECURSO / ARCHIVO", "HTTP", "TAMAÑO", "TIEMPO"],
      [330, 47, 71, 71],
      site.resources
        .slice(0, 16)
        .map((r) => [
          r.url,
          r.status === null ? "N/D" : String(r.status),
          r.bytes == null ? "N/D" : `${(r.bytes / 1024).toFixed(1)} KB`,
          r.durationMs == null
            ? "N/D"
            : `${(r.durationMs / 1000).toFixed(2)} s`,
        ]),
      "03 / Recursos · continuación",
    );
    if (site.resources.length > 16)
      paragraph(
        `Muestra de 16 de ${site.resources.length} registros seleccionados. El informe HTML conserva el inventario ampliado.`,
        9,
      );
    heading("Páginas examinadas");
    for (const p of site.pages)
      paragraph(
        `${p.url} · HTTP ${p.status ?? "no registrado"} · ${p.method === "browser" ? "Navegador" : "HTTP/HTML"} · ${p.resourceCount} recursos registrados`,
        9,
      );
  }
  newPage(site ? "04 / Rendimiento móvil y PC" : "02 / Rendimiento móvil y PC");
  paragraph(
    report.source === "Playwright / Chromium"
      ? "Medición de carga en navegador"
      : "Google PageSpeed Insights · Pruebas independientes por dispositivo",
    9,
  );
  paragraph(
    "Las condiciones de laboratorio de móvil y PC son distintas. La nota de velocidad no mide la salud completa de WordPress ni verifica formularios o ventas.",
    10,
  );
  y -= 20;
  const profiles = [
    {
      name: report.strategy === "desktop" ? "PC / ESCRITORIO" : "MÓVIL",
      data: report,
    },
    ...(report.desktop
      ? [{ name: "PC / ESCRITORIO", data: report.desktop }]
      : []),
  ];
  const colWidth = (width - 14) / profiles.length;
  const cardTop = y;
  for (const [i, profile] of profiles.entries()) {
    const left = x + i * (colWidth + 14);
    box(left, cardTop - 85, colWidth, 97);
    draw(profile.name, left + 14, cardTop - 10, 9, bold, c.muted);
    draw(
      profile.data.performanceScore === null
        ? "Sin puntuación"
        : `${profile.data.performanceScore} / 100`,
      left + 14,
      cardTop - 43,
      23,
      bold,
      c.ink,
    );
    draw(
      `${date(profile.data.measuredAt)} · Colombia`,
      left + 14,
      cardTop - 68,
      7,
      regular,
      c.ink,
    );
  }
  y -= 120;
  const labels = [
    ...new Set(profiles.flatMap((p) => p.data.metrics.map((m) => m.label))),
  ];
  for (const label of labels) {
    ensure(64, "04 / Rendimiento · continuación");
    for (const [i, profile] of profiles.entries()) {
      const left = x + i * (colWidth + 14);
      const m = profile.data.metrics.find((m) => m.label === label);
      rect(left, y - 42, colWidth, 54, c.wash);
      draw(label, left + 12, y - 4, 8, regular, c.muted);
      draw(
        !m || m.value === null
          ? "No medido"
          : m.unit === "ms"
            ? m.value >= 1000
              ? `${(m.value / 1000).toFixed(1).replace(".", ",")} s`
              : `${m.value.toFixed(0)} ms`
            : m.value.toFixed(4).replace(".", ","),
        left + 12,
        y - 27,
        15,
        bold,
      );
    }
    y -= 64;
  }
  y -= 14;
  if (!report.desktop && report.strategy === "mobile") {
    heading("PC / Escritorio: No medido");
    paragraph(
      "No hay una medición independiente de PC disponible. No se deduce su puntuación del resultado móvil.",
      9,
    );
  }
  if (report.observations.length) {
    heading("Otras señales públicas");
    for (const o of report.observations)
      paragraph(`${o.label}: ${o.state.replaceAll("_", " ")}.`, 9.5);
  }
  newPage(
    site ? "05 / Alcance y próximos pasos" : "03 / Alcance y próximos pasos",
  );
  paragraph(
    "Lee los hallazgos junto con estas condiciones de la prueba. Un resultado externo orienta la revisión; no sustituye el acceso autorizado a los registros internos.",
    10,
  );
  heading("Qué cubre esta revisión");
  for (const limit of [
    ...new Set([
      ...report.limits,
      ...(site?.limitations ?? []),
      ...(browser?.limitations ?? []),
    ]),
  ]) {
    paragraph("- " + limit, 9);
    y -= 5;
  }
  heading("Tu siguiente paso");
  paragraph(
    "Contrastar las evidencias con la función afectada y los registros internos, con autorización. Antes de intervenir se acuerdan alcance, respaldo y precio. Este diagnóstico no autoriza cambios ni te obliga a contratar.",
    10,
  );
  y -= 12;
  paragraph(
    "WP Doctor · Un producto de Roicas · wpdoctor@roicas.com",
    10,
    c.red,
  );
  for (const [i, p] of pdf.getPages().entries()) {
    p.drawLine({
      start: { x, y: 48 },
      end: { x: x + width, y: 48 },
      thickness: 0.6,
      color: c.line,
    });
    p.drawText("WP DOCTOR / ROICAS", {
      x,
      y: 32,
      size: 7,
      font: bold,
      color: c.muted,
    });
    p.drawText(`${i + 1} / ${pdf.getPageCount()}`, {
      x: 525,
      y: 32,
      size: 8,
      font: regular,
      color: c.muted,
    });
  }
  return new Uint8Array(await pdf.save());
}
