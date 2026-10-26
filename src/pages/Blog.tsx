import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { publishedArticles, readingMinutes } from "@/lib/blog";

export default function Blog() {
  return <div className="min-h-screen bg-background">
    <SeoHead title="Blog | ROICAS" description="Guías y recursos del equipo de ROICAS para tu negocio digital." canonical="/blog" noindex={!publishedArticles.length} />
    <Header />
    <main className="section-container pt-32 md:pt-40 pb-24">
      <p className="text-brand font-semibold mb-4">Ideas para tu negocio</p>
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Blog de ROICAS</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mb-12">Guías prácticas para tomar decisiones sobre tu presencia digital, tus ventas y tus procesos.</p>
      {publishedArticles.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{publishedArticles.map(post => <article key={post.slug} className="rounded-2xl border border-border p-7 flex flex-col">
        <p className="text-sm text-brand mb-4">{post.category} · {readingMinutes(post)} min de lectura</p>
        <h2 className="text-2xl font-bold mb-4"><Link to={`/blog/${post.slug}`} className="hover:text-brand">{post.title}</Link></h2>
        <p className="text-muted-foreground mb-6">{post.description}</p>
        <Link to={`/blog/${post.slug}`} className="mt-auto font-semibold text-brand">Leer artículo →</Link>
      </article>)}</div> : <div className="rounded-2xl border border-border bg-muted/30 p-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Estamos preparando las primeras guías</h2>
        <p className="text-muted-foreground mb-6">Mientras tanto, conoce cómo podemos acompañar tu próximo proyecto.</p>
        <Link to="/servicios" className="font-semibold text-brand underline">Explorar servicios</Link>
      </div>}
    </main><Footer />
  </div>;
}
