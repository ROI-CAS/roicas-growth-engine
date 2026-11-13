import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Search, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { publishedArticles, readingMinutes, getCoverImage, getAuthorAvatar, type BlogArticle } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { useBooking } from "@/contexts/BookingContext";
import "./editorial.css";

const categories = Array.from(new Set(publishedArticles.map(post => post.category)));
const dateFormat = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeZone: "UTC" });
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-CO").trim();

function Guide({ post, featured }: { post: BlogArticle; featured: boolean }) {
  const headingId = `guide-${post.slug}`;
  return (
    <article className={featured ? "red-guide red-guide-featured" : "red-guide"}>
      <Link to={`/blog/${post.slug}`} className="red-guide-link" aria-labelledby={headingId}>
        <img src={getCoverImage(post)} alt="" loading={featured ? "eager" : "lazy"} decoding="async" className="red-guide-image" />
        <div className="red-guide-content">
          <p className="red-guide-topic">{post.category}</p>
          <h3 id={headingId}>{post.title}</h3>
          <p>{post.description}</p>
          <div className="red-guide-read"><Clock size={15} aria-hidden="true" /> {readingMinutes(post)} min de lectura <ArrowRight size={19} aria-hidden="true" /></div>
        </div>
      </Link>
      <div className="red-guide-meta">
        <img className="red-brand-avatar" src={getAuthorAvatar(post)} alt="" width={26} height={26} loading="lazy" />
        <span>{post.author}</span>
        <time dateTime={post.published}>{dateFormat.format(new Date(`${post.published}T00:00:00Z`))}</time>
      </div>
    </article>
  );
}

export default function Blog() {
  const { openBooking } = useBooking();
  const [params, setParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const requestedCategory = params.get("tema");
  const selectedCategory = categories.find(category => category === requestedCategory) ?? "";
  const search = normalize(searchQuery);
  const filteredPosts = useMemo(() => publishedArticles.filter(post => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (!search) return true;
    const searchable = [post.title, post.description, post.category, ...post.sections.flatMap(section => [section.heading, ...section.paragraphs])];
    return searchable.some(value => normalize(value).includes(search));
  }), [selectedCategory, search]);

  function chooseCategory(category: string) {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (category) next.set("tema", category);
      else next.delete("tema");
      return next;
    }, { preventScrollReset: true });
  }

  function clearSearch() {
    searchInput.current?.focus();
    setSearchQuery("");
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de ROICAS - El Marketing que Convierte",
    description: "Guías tácticas, recursos y análisis de e-commerce, SEO, publicidad digital y automatización con IA para empresas.",
    url: `${SITE_URL}/blog`,
    publisher: { "@type": "Organization", name: "ROICAS", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-roicas-email.png` } },
    blogPost: publishedArticles.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: getCoverImage(post),
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.published,
      dateModified: post.modified,
      author: { "@type": "Organization", name: post.author },
    })),
  };

  return (
    <div className="roicas-editorial">
      <SeoHead
        title="Blog de ROICAS | Estrategias de E-commerce, SEO, Pauta e IA"
        description="Aprende a escalar las ventas y optimizar las operaciones de tu negocio con guías prácticas sobre tiendas online, pauta digital, automatización con IA y SEO."
        canonical="/blog"
        schemaJson={blogSchema}
      />
      <Header />
      <main id="contenido-principal" tabIndex={-1}>
        <header className="red-hero red-blog-hero">
          <ParticlesBackground particleCount={25} speed={0.18} />
          <div className="section-container red-hero-content">
            <h1>Blog de ROICAS</h1>
            <p>Guías para decidir qué mejorar en tu web, cómo atraer clientes y qué procesos vale la pena automatizar.</p>
            <div className="red-search" role="search" aria-label="Buscar guías">
              <label htmlFor="guide-search">Buscar en las guías</label>
              <div className="red-search-field">
                <Search size={20} aria-hidden="true" />
                <input ref={searchInput} id="guide-search" type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Ej. SEO, pagos o automatización" aria-controls="guide-results" />
                {searchQuery && <button type="button" aria-label="Borrar búsqueda" onClick={clearSearch}><X size={18} aria-hidden="true" /></button>}
              </div>
            </div>
          </div>
        </header>

        <section className="section-container red-guides" aria-labelledby="guide-heading">
          <div className="red-guides-heading">
            <h2 id="guide-heading">Explora las guías</h2>
            <p role="status">{filteredPosts.length} {filteredPosts.length === 1 ? "guía" : "guías"}</p>
          </div>
          <div className="red-topics" role="group" aria-label="Filtrar por tema">
            {["", ...categories].map(category => (
              <button key={category} type="button" onClick={() => chooseCategory(category)} aria-pressed={selectedCategory === category} aria-controls="guide-results">{category || "Todos los temas"}</button>
            ))}
          </div>
          <div id="guide-results" className="red-guide-grid">
            {filteredPosts.map((post, index) => <Guide key={post.slug} post={post} featured={index === 0 && !selectedCategory && !search} />)}
          </div>
          {!filteredPosts.length && (
            <div className="red-empty">
              <BookOpen size={30} aria-hidden="true" />
              <h3>{publishedArticles.length ? "No encontramos guías con esos filtros" : "Estamos preparando nuevas guías"}</h3>
              {publishedArticles.length > 0 && <><p>Prueba otro término o consulta todos los temas.</p><button type="button" className="red-action" onClick={() => { clearSearch(); chooseCategory(""); }}>Ver todas las guías</button></>}
            </div>
          )}
        </section>

        <section className="section-container red-next">
          <div><h2>¿Qué quieres mejorar primero?</h2><p>Revisamos tu situación y te ayudamos a definir el siguiente paso.</p></div>
          <div className="red-actions">
            <button type="button" className="red-action" onClick={openBooking}>Agendar consultoría</button>
            <Link to="/cotizar-tienda-online" className="red-action red-action-outline">Cotizar mi tienda <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

