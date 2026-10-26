import { Helmet } from "react-helmet-async";
import { canonicalUrl, SITE_URL } from "@/lib/site";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
  schemaJson?: object | object[];
  article?: { published: string; modified: string; author: string };
}

const BASE_OG_IMAGE = `${SITE_URL}/og-image.png`;

const SeoHead = ({
  title,
  description,
  canonical,
  ogImage = BASE_OG_IMAGE,
  noindex = false,
  schemaJson,
  article,
}: SeoHeadProps) => {
  canonical = canonicalUrl(canonical);
  const schemas = schemaJson
    ? Array.isArray(schemaJson) ? schemaJson : [schemaJson]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={article ? "article" : "website"} />
      {article && <meta property="article:published_time" content={article.published} />}
      {article && <meta property="article:modified_time" content={article.modified} />}
      {article && <meta property="article:author" content={article.author} />}
      <meta property="og:locale" content="es_CO" />
      <meta property="og:site_name" content="ROICAS" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@ROICAS" />

      {/* JSON-LD */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema).replace(/https:\/\/roicas\.com(?=[/"#])/g, SITE_URL).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
