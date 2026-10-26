import { z } from "zod";

const text = z.string().min(1);
export const articleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["draft", "published"]), title: text, description: text,
  category: text, author: text, published: z.string().date(), modified: z.string().date(),
  introduction: text,
  sections: z.array(z.object({ heading: text, paragraphs: z.array(text).min(1), checklist: z.array(text).optional() })).min(1),
  service: z.object({ label: text, href: z.string().regex(/^\/servicios\/[a-z0-9-]+$/) }),
}).refine(post => post.modified >= post.published, "La actualización no puede preceder a la publicación");
export type BlogArticle = z.infer<typeof articleSchema>;
const modules = import.meta.glob("../content/blog/*.json", { eager: true, import: "default" });
export const publishedArticles = Object.values(modules).map(value => articleSchema.parse(value))
  .filter(post => post.status === "published").sort((a, b) => b.published.localeCompare(a.published));
if (new Set(publishedArticles.map(post => post.slug)).size !== publishedArticles.length) throw new Error("Hay artículos con direcciones duplicadas");
export function readingMinutes(post: BlogArticle) {
  const words = [post.introduction, ...post.sections.flatMap(s => [s.heading, ...s.paragraphs, ...(s.checklist || [])])].join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
