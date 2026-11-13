import { z } from "zod";

const text = z.string().min(1);

export const sectionSchema = z.object({
  heading: text,
  paragraphs: z.array(text).min(1),
  checklist: z.array(text).optional(),
  callout: z
    .object({
      type: z.enum(["tip", "warning", "metric"]).default("tip"),
      title: text,
      text: text,
    })
    .optional(),
  image: z
    .object({
      url: text,
      alt: text,
      caption: z.string().optional(),
    })
    .optional(),
});

export const comparisonTableSchema = z.object({
  title: text,
  subtitle: z.string().optional(),
  columnA: text,
  columnB: text,
  rows: z.array(
    z.object({
      criterion: text,
      valA: text,
      valB: text,
    })
  ).min(2),
});

export const roicasSolutionSchema = z.object({
  title: text,
  description: text,
  deliverables: z.array(
    z.object({
      title: text,
      description: text,
    })
  ).min(2),
  ctaText: z.string().optional(),
});

export const articleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["draft", "published"]),
  title: text,
  description: text,
  category: text,
  author: text,
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.string().date(),
  modified: z.string().date(),
  introduction: text,
  sections: z.array(sectionSchema).min(1),
  comparisonTable: comparisonTableSchema.optional(),
  roicasSolution: roicasSolutionSchema.optional(),
  service: z.object({
    label: text,
    href: z.string().regex(/^\/(?:servicios\/[a-z0-9-]+|cotizar-tienda-online|contacto|cotizar)$/),
  }),
}).refine((post) => post.modified >= post.published, "La actualización no puede preceder a la publicación");

export type BlogArticle = z.infer<typeof articleSchema>;

const modules = import.meta.glob("../content/blog/*.json", { eager: true, import: "default" });

export const publishedArticles = Object.values(modules)
  .map((value) => articleSchema.parse(value))
  .filter((post) => post.status === "published")
  .sort((a, b) => b.published.localeCompare(a.published));

if (new Set(publishedArticles.map((post) => post.slug)).size !== publishedArticles.length) {
  throw new Error("Hay artículos con direcciones duplicadas");
}

export function readingMinutes(post: BlogArticle) {
  const extraWords: string[] = [];
  if (post.comparisonTable) {
    extraWords.push(post.comparisonTable.title, post.comparisonTable.subtitle || "");
    for (const r of post.comparisonTable.rows) {
      extraWords.push(r.criterion, r.valA, r.valB);
    }
  }
  if (post.roicasSolution) {
    extraWords.push(post.roicasSolution.title, post.roicasSolution.description);
    for (const d of post.roicasSolution.deliverables) {
      extraWords.push(d.title, d.description);
    }
  }
  for (const s of post.sections) {
    if (s.callout) extraWords.push(s.callout.title, s.callout.text);
    if (s.image?.caption) extraWords.push(s.image.caption);
  }

  const words = [
    post.introduction,
    ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.checklist || [])]),
    ...extraWords,
  ]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const categoryCovers: Record<string, string> = {
  "Tiendas Online": "/blog/tiendas-online.jpg",
  "Automatización con IA": "/blog/automatizacion-ia.jpg",
  "SEO": "/blog/seo-empresas.jpg",
  "Publicidad Digital": "/blog/pauta-digital.jpg",
  "Diseño Web": "/blog/diseno-web.jpg",
};

export function getCoverImage(post: BlogArticle): string {
  return post.coverImage || categoryCovers[post.category] || "/blog/tiendas-online.jpg";
}

export function getAuthorAvatar(post: BlogArticle): string {
  return post.authorAvatar || "/favicon.png";
}
