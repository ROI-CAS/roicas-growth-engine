import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Check, ChevronRight, Clock, Lightbulb, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import NotFound from "./NotFound";
import { publishedArticles, readingMinutes, getCoverImage, getAuthorAvatar, type BlogArticle as ArticleData } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { useBooking } from "@/contexts/BookingContext";
import "./editorial.css";

const dateFormat = new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "UTC" });
const formatDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));

export default function BlogArticle() {
  const { slug } = useParams();
  const post = publishedArticles.find(article => article.slug === slug);
  return post ? <Article key={post.slug} post={post} /> : <NotFound />;
}

function Article({ post }: { post: ArticleData }) {
  const { openBooking } = useBooking();
  const [shareState, setShareState] = useState<"idle" | "copied" | "manual">("idle");
  const url = `${SITE_URL}/blog/${post.slug}`;
  const cover = getCoverImage(post);
  const avatar = getAuthorAvatar(post);
  const otherPosts = publishedArticles.filter(article => article.slug !== post.slug);
  const related = [
    ...otherPosts.filter(article => article.category === post.category),
    ...otherPosts.filter(article => article.category !== post.category),
  ].slice(0, 2);

  async function shareArticle() {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.description, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
    } catch {
      setShareState("manual");
    }
  }

  return (
    <div className="roicas-editorial">
      <SeoHead
        title={`${post.title} | Blog ROICAS`}
        description={post.description}
        canonical={url}
        article={{ published: post.published, modified: post.modified, author: post.author }}
        schemaJson={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.published,
            dateModified: post.modified,
            mainEntityOfPage: url,
            image: cover,
            author: { "@type": "Organization", name: post.author, url: `${SITE_URL}/nosotros` },
            publisher: { "@type": "Organization", name: "ROICAS", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-roicas-email.png` } },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ]}
      />
      <Header />
      <main id="contenido-principal" tabIndex={-1}>
        <article>
          <header className="red-hero red-hero-compact">
            <ParticlesBackground particleCount={24} speed={0.18} />
            <div className="section-container red-hero-content red-article-header">
              <nav className="red-breadcrumb" aria-label="Ruta de navegación">
                <Link to="/">Inicio</Link>
                <ChevronRight size={14} aria-hidden="true" />
                <Link to="/blog">Blog</Link>
                <ChevronRight size={14} aria-hidden="true" />
                <Link to={`/blog?tema=${encodeURIComponent(post.category)}`}>{post.category}</Link>
              </nav>
              <h1>{post.title}</h1>
              <div className="red-article-meta">
                <span><img className={avatar === "/favicon.png" ? "red-brand-avatar" : undefined} src={avatar} alt="" width={28} height={28} />{post.author}</span>
                <time dateTime={post.published}><Calendar size={15} aria-hidden="true" />{formatDate(post.published)}</time>
                <span><Clock size={15} aria-hidden="true" />{readingMinutes(post)} min de lectura</span>
                <button className="red-action red-action-outline" type="button" onClick={shareArticle}><Share2 size={16} aria-hidden="true" />Compartir guía</button>
              </div>
              {post.modified !== post.published && <p>Actualizado el <time dateTime={post.modified}>{formatDate(post.modified)}</time></p>}
              <div role="status">{shareState === "copied" && <p>Enlace copiado.</p>}</div>
              {shareState === "manual" && (
                <div className="red-search">
                  <label htmlFor="share-guide-url">Selecciona y copia el enlace</label>
                  <div className="red-search-field"><input id="share-guide-url" readOnly value={url} onFocus={event => event.target.select()} /></div>
                </div>
              )}
            </div>
          </header>

          <div className="section-container red-article-main">
            <div className="red-article-body">
              <img className="mb-7 aspect-video w-full rounded-xl object-cover" src={cover} alt={post.title} decoding="async" />
              <p className="text-lg leading-relaxed md:text-xl">{post.introduction}</p>

              <nav className="red-toc" aria-labelledby="article-contents">
                <h2 id="article-contents" className="flex items-center gap-2"><BookOpen size={17} aria-hidden="true" /> En esta guía</h2>
                <ol>
                  {post.sections.map((section, index) => <li key={index}><a href={`#seccion-${index + 1}`}>{section.heading}</a></li>)}
                  {post.comparisonTable && <li><a href="#comparativa">{post.comparisonTable.title}</a></li>}
                  {post.roicasSolution && <li><a href="#solucion-roicas">{post.roicasSolution.title}</a></li>}
                </ol>
              </nav>

              <div className="space-y-10">
                {post.sections.map((section, index) => (
                  <section key={index} id={`seccion-${index + 1}`} className="space-y-4">
                    <h2 className="text-2xl font-bold leading-tight md:text-3xl">{section.heading}</h2>
                    {section.paragraphs.map((paragraph, paragraphIndex) => <p className="text-base leading-[1.75] md:text-lg" key={paragraphIndex}>{paragraph}</p>)}
                    {section.image && (
                      <figure>
                        <img src={section.image.url} alt={section.image.alt} className="w-full" loading="lazy" decoding="async" />
                        {section.image.caption && <figcaption className="mt-2 text-sm text-muted-foreground">{section.image.caption}</figcaption>}
                      </figure>
                    )}
                    {section.callout && (
                      <aside className="red-reading-note">
                        <Lightbulb size={20} aria-hidden="true" />
                        <div><h3>{section.callout.title}</h3><p>{section.callout.text}</p></div>
                      </aside>
                    )}
                    {section.checklist?.length > 0 && (
                      <div className="red-reading-checklist">
                        <h3>Puntos de acción para implementar</h3>
                        <ul>{section.checklist.map((item, itemIndex) => <li key={itemIndex}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {post.comparisonTable && (
                <section id="comparativa" className="mt-12 border-t border-border pt-6">
                  <h2 id="comparison-title" className="text-2xl md:text-3xl">{post.comparisonTable.title}</h2>
                  {post.comparisonTable.subtitle && <p className="mt-2 text-muted-foreground">{post.comparisonTable.subtitle}</p>}
                  <div className="red-table mt-4 rounded-xl border border-border" role="region" tabIndex={0} aria-labelledby="comparison-title">
                    <table className="w-full text-left">
                      <thead><tr><th scope="col">Factor / Criterio</th><th scope="col">{post.comparisonTable.columnA}</th><th scope="col">{post.comparisonTable.columnB}</th></tr></thead>
                      <tbody>{post.comparisonTable.rows.map((row, index) => <tr key={index}><th scope="row">{row.criterion}</th><td>{row.valA}</td><td>{row.valB}</td></tr>)}</tbody>
                    </table>
                  </div>
                </section>
              )}

              <section id="solucion-roicas" className="red-article-service">
                <h2>{post.roicasSolution?.title || "Lleva esta guía a tu proyecto"}</h2>
                <p>{post.roicasSolution?.description || "Explora cómo podemos ayudarte a aplicar estas ideas en tu empresa."}</p>
                {post.roicasSolution && (
                  <ul className="red-deliverables">{post.roicasSolution.deliverables.map((item, index) => <li key={index}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ul>
                )}
                <div className="red-actions">
                  <Link className="red-action" to={post.service.href}>{post.roicasSolution?.ctaText || post.service.label}<ArrowRight size={16} aria-hidden="true" /></Link>
                  <button className="red-action red-action-outline" type="button" onClick={openBooking}>Agendar consultoría</button>
                </div>
                {post.roicasSolution?.ctaText && post.roicasSolution.ctaText !== post.service.label && <Link className="red-text-link" to={post.service.href}>{post.service.label}</Link>}
              </section>

              <section className="red-byline" aria-label="Autoría de la guía">
                <img className={avatar === "/favicon.png" ? "red-brand-avatar" : undefined} src={avatar} alt="" width={54} height={54} loading="lazy" />
                <div><h2>{post.author}</h2><p>{post.authorRole || "Especialistas en Growth & Tecnología Digital"}</p></div>
              </section>

              {related.length > 0 && (
                <section className="red-related" aria-labelledby="related-heading">
                  <h2 id="related-heading">Sigue leyendo</h2>
                  <ul>{related.map(article => <li key={article.slug}><Link to={`/blog/${article.slug}`}>
                    <span className="red-guide-topic">{article.category}</span><strong>{article.title}</strong><ArrowRight size={18} aria-hidden="true" />
                  </Link></li>)}</ul>
                </section>
              )}
              <Link to="/blog" className="red-text-link"><ArrowLeft size={16} aria-hidden="true" />Ver todas las guías</Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

