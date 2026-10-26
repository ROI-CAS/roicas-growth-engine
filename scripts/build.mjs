import { build } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

await build();
await build({ build: { ssr: "src/entry-server.tsx", outDir: "dist-ssr", copyPublicDir: false } });
const { render, siteRoutes, SITE_URL, publishedArticles } = await import("../dist-ssr/entry-server.js");
const template = await readFile("dist/index.html", "utf8");
const cleanTemplate = template
  .replace(/\s*<title>[\s\S]*?<\/title>/g, "")
  .replace(/\s*<meta\s+(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, "");
const routes = [...siteRoutes, "/blog", ...publishedArticles.map(post => `/blog/${post.slug}`)];
for (const route of [...routes, "/404"]) {
  const { html, head } = render(route);
  if (!html.includes("<h1")) throw new Error(`Falta H1 en ${route}`);
  const result = cleanTemplate.replace("</head>", () => `${head}\n</head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
    .replace("</head>", '<noscript><style>#root [style*="opacity:0"]{opacity:1!important;transform:none!important}</style></noscript></head>');
  const destination = resolve("dist", route === "/" ? "index.html" : `${route.slice(1)}.html`);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, result);
}
const indexedRoutes = routes.filter(route => route !== "/blog" || publishedArticles.length);
const urls = indexedRoutes.map(route => {
  const post = publishedArticles.find(post => `/blog/${post.slug}` === route);
  return `  <url><loc>${SITE_URL}${route === "/" ? "/" : route}</loc>${post ? `<lastmod>${post.modified}</lastmod>` : ""}</url>`;
});
await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`HTML generado para ${routes.length} páginas y la página 404.`);
