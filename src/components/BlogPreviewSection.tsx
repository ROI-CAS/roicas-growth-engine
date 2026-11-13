import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { publishedArticles, readingMinutes, getCoverImage } from "@/lib/blog";
import "./blog-preview.css";

export default function BlogPreviewSection() {
  if (!publishedArticles.length) return null;

  const topArticles = publishedArticles.slice(0, 3);

  return (
    <section className="roicas-guides-section" aria-labelledby="guides-title">
      <div className="rgb-inner">
        <div className="rgb-header">
          <div>
            <span className="rgb-eyebrow">
              <BookOpen size={16} aria-hidden="true" />
              Recursos & Criterio Técnico
            </span>
            <h2 id="guides-title">Ideas para tu siguiente paso digital.</h2>
          </div>
          <Link to="/blog" className="rgb-all-link">
            <span>Ver todas las guías y artículos</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="rgb-grid">
          {topArticles.map((article) => (
            <Link 
              to={`/blog/${article.slug}`} 
              key={article.slug} 
              className="rgb-card"
            >
              <div className="rgb-card-thumb-wrap">
                <img 
                  src={getCoverImage(article)} 
                  alt={article.title} 
                  className="rgb-card-thumb"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={225}
                />
              </div>
              <div className="rgb-card-body">
                <div className="rgb-card-meta">
                  <span className="rgb-card-badge">{article.category}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} aria-hidden="true" />
                    {readingMinutes(article)} min de lectura
                  </span>
                </div>
                <h3>{article.title}</h3>
                <div className="rgb-card-footer">
                  <span>Leer artículo</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
