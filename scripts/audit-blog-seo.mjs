import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.resolve("src/content/blog");

// Clichés típicos de IA en español que delatan texto sintético no curado
const AI_CLICHES = [
  { pattern: /en el vertiginoso mundo/i, label: "Cliché 'En el vertiginoso mundo'" },
  { pattern: /en la era digital actual/i, label: "Cliché 'En la era digital actual'" },
  { pattern: /en conclusión,?\s/i, label: "Conclusión formulaica de IA ('En conclusión')" },
  { pattern: /a modo de resumen/i, label: "Conclusión formulaica de IA ('A modo de resumen')" },
  { pattern: /es crucial destacar que/i, label: "Muletilla de relleno ('Es crucial destacar que')" },
  { pattern: /cabe destacar que|cabe mencionar que/i, label: "Muletilla pasiva ('Cabe destacar / mencionar que')" },
  { pattern: /juega un papel crucial|juega un rol fundamental/i, label: "Cliché 'Juega un papel crucial/fundamental'" },
  { pattern: /no solo [^,]+, sino (?:también )?[^.]+/i, label: "Estructura repetitiva de IA ('No solo X, sino Y')" },
  { pattern: /un tapiz de|un sinfín de posibilidades/i, label: "Metáfora artificial de IA" },
  { pattern: /es imperativo|resulta imperativo/i, label: "Lenguaje acartonado de IA ('Es imperativo')" },
  { pattern: /sumérgete en|sumerjámonos/i, label: "Llamado cliché de IA ('Sumérgete en')" },
  { pattern: /sin más preámbulos/i, label: "Fórmula de relleno ('Sin más preámbulos')" },
  { pattern: /como es bien sabido|como todos sabemos/i, label: "Premisa vacía de IA" },
];

// Señales de contexto local y E-E-A-T (Experiencia y realidad del mercado)
const EEAT_TERMS = [
  "colombia", "bogotá", "medellín", "cali", "barranquilla",
  "pse", "wompi", "bold", "dian", "cop", "pesos",
  "tasa de conversión", "roas", "cac", "roi", "leads", "ctr",
  "n8n", "shopify", "woocommerce", "meta ads", "google ads", "crm"
];

function analyzeArticle(file) {
  const filePath = path.join(BLOG_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const extraTexts = [];
  if (data.comparisonTable) {
    extraTexts.push(data.comparisonTable.title, data.comparisonTable.subtitle || "");
    for (const r of data.comparisonTable.rows) {
      extraTexts.push(r.criterion, r.valA, r.valB);
    }
  }
  if (data.roicasSolution) {
    extraTexts.push(data.roicasSolution.title, data.roicasSolution.description);
    for (const d of data.roicasSolution.deliverables) {
      extraTexts.push(d.title, d.description);
    }
  }
  for (const s of data.sections) {
    if (s.callout) extraTexts.push(s.callout.title, s.callout.text);
    if (s.image?.caption) extraTexts.push(s.image.caption);
  }

  const fullText = [
    data.title,
    data.description,
    data.introduction,
    ...data.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.checklist || [])]),
    ...extraTexts,
  ].join(" ");

  const words = fullText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Separar oraciones para medir "burstiness" (variabilidad de longitud humana)
  const sentences = fullText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length > 2);

  const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / (sentenceLengths.length || 1);
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgSentenceLength, 2), 0) / (sentenceLengths.length || 1);
  const stdDev = Math.sqrt(variance);

  // 1. Evaluación SEO On-Page (Máx 50 pts)
  let seoScore = 0;
  const seoChecks = [];

  // Título (40 - 70 caracteres)
  if (data.title.length >= 35 && data.title.length <= 70) {
    seoScore += 10;
    seoChecks.push({ pass: true, text: `Título SEO óptimo (${data.title.length} caracteres)` });
  } else {
    seoScore += 5;
    seoChecks.push({ pass: false, text: `Título fuera de rango ideal 35-70 car. (${data.title.length} car.)` });
  }

  // Meta descripción (120 - 165 caracteres)
  if (data.description.length >= 110 && data.description.length <= 170) {
    seoScore += 10;
    seoChecks.push({ pass: true, text: `Meta descripción calibrada para Google (${data.description.length} car.)` });
  } else {
    seoScore += 5;
    seoChecks.push({ pass: false, text: `Meta descripción fuera de rango 110-170 car. (${data.description.length} car.)` });
  }

  // Extensión de contenido (> 600 palabras para posicionamiento orgánico)
  if (wordCount >= 1000) {
    seoScore += 15;
    seoChecks.push({ pass: true, text: `Extensión profunda y competitiva (${wordCount} palabras)` });
  } else if (wordCount >= 600) {
    seoScore += 10;
    seoChecks.push({ pass: true, text: `Extensión aceptable (${wordCount} palabras - ideal >1000)` });
  } else {
    seoScore += 4;
    seoChecks.push({ pass: false, text: `Contenido corto (${wordCount} palabras). Riesgo de 'Thin Content'.` });
  }

  // Estructura de encabezados (Mínimo 3 secciones H2)
  if (data.sections.length >= 3) {
    seoScore += 10;
    seoChecks.push({ pass: true, text: `Buena arquitectura de encabezados (${data.sections.length} secciones H2)` });
  } else {
    seoScore += 5;
    seoChecks.push({ pass: false, text: `Pocas secciones H2 (${data.sections.length}). Añade más profundidad.` });
  }

  // Recursos visuales y autor
  if (data.coverImage && data.authorAvatar) {
    seoScore += 5;
    seoChecks.push({ pass: true, text: "Imagen de portada y avatar de autor configurados" });
  } else {
    seoChecks.push({ pass: false, text: "Falta portada o avatar de autor" });
  }

  // 2. Evaluación de Humanización & Anti-Penalización IA (Máx 50 pts)
  let humanScore = 0;
  const humanChecks = [];

  // Detección de clichés de IA
  const detectedCliches = [];
  for (const { pattern, label } of AI_CLICHES) {
    if (pattern.test(fullText)) {
      detectedCliches.push(label);
    }
  }

  if (detectedCliches.length === 0) {
    humanScore += 20;
    humanChecks.push({ pass: true, text: "Cero clichés y muletillas robóticas detectadas (100% natural)" });
  } else if (detectedCliches.length <= 2) {
    humanScore += 10;
    humanChecks.push({ pass: false, text: `Muletillas sintéticas encontradas: ${detectedCliches.join(", ")}` });
  } else {
    humanScore += 2;
    humanChecks.push({ pass: false, text: `Exceso de fórmulas de IA (${detectedCliches.length}): ${detectedCliches.join(", ")}` });
  }

  // Burstiness / Variabilidad de longitud de oraciones (Signo clave de redacción humana)
  // Las IAs suelen tener stdDev < 5; los redactores humanos suelen tener stdDev > 7
  if (stdDev >= 6.5) {
    humanScore += 15;
    humanChecks.push({ pass: true, text: `Ritmo y cadencia humana excelente (Variabilidad oracional σ=${stdDev.toFixed(1)})` });
  } else {
    humanScore += 7;
    humanChecks.push({ pass: false, text: `Estructura de oraciones algo monótona (σ=${stdDev.toFixed(1)}). Mezcla frases cortas y largas.` });
  }

  // Contexto Real & E-E-A-T (Colombia, marcas, herramientas, métricas)
  const lowerText = fullText.toLowerCase();
  const matchedEEAT = EEAT_TERMS.filter((term) => lowerText.includes(term));
  if (matchedEEAT.length >= 4) {
    humanScore += 15;
    humanChecks.push({ pass: true, text: `Alta autoridad E-E-A-T y contexto de mercado real (${matchedEEAT.slice(0, 5).join(", ")})` });
  } else if (matchedEEAT.length >= 2) {
    humanScore += 8;
    humanChecks.push({ pass: true, text: `Contexto local moderado (${matchedEEAT.join(", ")}). Añade más datos locales o herramientas.` });
  } else {
    humanScore += 3;
    humanChecks.push({ pass: false, text: "Texto genérico. Faltan referencias al mercado colombiano, métricas o casos reales." });
  }

  const totalScore = seoScore + humanScore;

  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    wordCount,
    totalScore,
    seoScore,
    humanScore,
    seoChecks,
    humanChecks,
  };
}

console.log("\n=======================================================");
console.log(" 🔍 AUDITORÍA DE SEO Y HUMANIZACIÓN — ROICAS BLOG");
console.log("    (Sistema de Validación Estilo Rank Math / E-E-A-T)");
console.log("=======================================================\n");

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
const results = files.map(analyzeArticle);

results.sort((a, b) => b.totalScore - a.totalScore);

for (const res of results) {
  const badge =
    res.totalScore >= 88
      ? "🟢 [EXCELENTE]"
      : res.totalScore >= 75
      ? "🟡 [BUENO]"
      : "🔴 [NECESITA MEJORAS]";

  console.log(`${badge} ${res.title}`);
  console.log(`   Puntaje Total: ${res.totalScore}/100 | SEO: ${res.seoScore}/50 | Humanización: ${res.humanScore}/50 | ${res.wordCount} palabras`);
  console.log(`   Categoría: ${res.category} | Slug: /blog/${res.slug}`);

  // Mostrar avisos si hay puntos pendientes
  const fails = [...res.seoChecks, ...res.humanChecks].filter((c) => !c.pass);
  if (fails.length > 0) {
    console.log("   ⚠️  Oportunidades de mejora:");
    for (const f of fails) {
      console.log(`      - ${f.text}`);
    }
  } else {
    console.log("   ✨ Pasa todos los filtros de Google y detección de IA sin observaciones.");
  }
  console.log("");
}

const avg = Math.round(results.reduce((acc, r) => acc + r.totalScore, 0) / results.length);
console.log("-------------------------------------------------------");
console.log(`📊 Promedio del Blog: ${avg}/100 (${results.length} artículos analizados)`);
console.log("-------------------------------------------------------\n");

