import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import NotFound from "./NotFound";
import { publishedArticles, readingMinutes } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export default function BlogArticle() {
  const { slug } = useParams();
  const post = publishedArticles.find(post => post.slug === slug);
  if (!post) return <NotFound />;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const date = (value: string) => new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  return <div className="bg-background min-h-screen">
    <SeoHead title={`${post.title} | ROICAS`} description={post.description} canonical={url}
      article={{ published: post.published, modified: post.modified, author: post.author }}
      schemaJson={[
        { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, datePublished: post.published, dateModified: post.modified, mainEntityOfPage: url, image: `${SITE_URL}/og-image.png`, author: { "@type": "Organization", name: post.author, url: `${SITE_URL}/nosotros` }, publisher: { "@type": "Organization", name: "ROICAS", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-roicas-email.png` } } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: url }] },
      ]} />
    <Header />
    <main className="section-container pt-28 md:pt-36 pb-20">
      <nav aria-label="Ruta de navegación" className="text-sm text-muted-foreground mb-8"><Link to="/">Inicio</Link> / <Link to="/blog">Blog</Link> / {post.category}</nav>
      <article className="max-w-3xl mx-auto">
        <header className="mb-10"><p className="text-brand font-semibold mb-4">{post.category}</p><h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
          <p className="text-sm text-muted-foreground">Por {post.author} · <time dateTime={post.published}>{date(post.published)}</time> · {readingMinutes(post)} min de lectura</p>
          {post.modified !== post.published && <p className="text-sm text-muted-foreground mt-2">Actualizado el <time dateTime={post.modified}>{date(post.modified)}</time></p>}
        </header>
        <p className="text-xl leading-relaxed mb-10">{post.introduction}</p>
        <nav aria-label="Contenido del artículo" className="rounded-2xl bg-muted/40 border border-border p-6 mb-12"><p className="font-semibold mb-3">En esta guía</p><ol className="space-y-2 list-decimal pl-5">{post.sections.map((s, i) => <li key={i}><a href={`#seccion-${i + 1}`} className="underline">{s.heading}</a></li>)}</ol></nav>
        {post.sections.map((section, i) => <section key={i} id={`seccion-${i + 1}`} className="scroll-mt-28 mb-12"><h2 className="text-2xl md:text-3xl font-bold mb-5">{section.heading}</h2>{section.paragraphs.map((p, j) => <p key={j} className="text-lg text-muted-foreground leading-relaxed mb-4">{p}</p>)}{section.checklist && <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground">{section.checklist.map((item, j) => <li key={j}>{item}</li>)}</ul>}</section>)}
        <aside className="border border-border rounded-2xl p-8 bg-muted/30"><h2 className="text-2xl font-bold mb-3">Lleva estas ideas a tu negocio</h2><p className="text-muted-foreground mb-6">Cuéntanos qué necesitas y revisamos el alcance de tu proyecto.</p><div className="flex flex-wrap gap-5"><Link to={post.service.href} className="font-semibold text-brand underline">{post.service.label}</Link><Link to="/contacto" className="font-semibold underline">Hablar con ROICAS</Link></div></aside>
      </article>
    </main><Footer />
  </div>;
}
