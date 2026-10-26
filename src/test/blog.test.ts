import { describe, expect, it } from "vitest";
import { articleSchema, publishedArticles, readingMinutes } from "@/lib/blog";
import { canonicalUrl } from "@/lib/site";

const post = {
  slug: "articulo-de-prueba", status: "published", title: "Artículo de prueba", description: "Descripción",
  category: "Pruebas", author: "Equipo ROICAS", published: "2026-10-26", modified: "2026-10-26",
  introduction: "Introducción", sections: [{ heading: "Sección", paragraphs: ["Explicación"] }],
  service: { label: "Servicio relacionado", href: "/servicios/tiendas-online" },
};
describe("Publicación editorial", () => {
  it("valida un artículo y calcula una lectura mínima", () => {
    expect(readingMinutes(articleSchema.parse(post))).toBe(1);
  });
  it("rechaza direcciones no seguras y fechas inconsistentes", () => {
    expect(articleSchema.safeParse({ ...post, slug: "../secreto" }).success).toBe(false);
    expect(articleSchema.safeParse({ ...post, service: { label: "Enlace", href: "//externo.com" } }).success).toBe(false);
    expect(articleSchema.safeParse({ ...post, modified: "2025-01-01" }).success).toBe(false);
  });
  it("publica exclusivamente artículos aprobados", () => {
    expect(publishedArticles.every(post => post.status === "published")).toBe(true);
  });
  it("unifica URL relativas y el dominio sin www", () => {
    expect(canonicalUrl("/servicios/seo")).toBe("https://www.roicas.com/servicios/seo");
    expect(canonicalUrl("https://roicas.com/contacto")).toBe("https://www.roicas.com/contacto");
  });
});
