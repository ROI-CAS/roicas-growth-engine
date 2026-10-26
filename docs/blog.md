# Blog y SEO de ROICAS

Los artículos publicados viven en `src/content/blog/*.json`. La plantilla genera HTML inicial, índice del artículo, autor, fechas visibles, tiempo de lectura, enlaces al servicio y datos estructurados BlogPosting y BreadcrumbList.

Conservar borradores fuera de esa carpeta. Antes de elegir temas y títulos, contrastar consultas y páginas de Search Console para evitar competir con los servicios existentes. No usar resultados, testimonios ni métricas sin evidencia.

Cada archivo sigue esta estructura. Las fechas deben reflejar publicación y actualización reales; no se renuevan automáticamente en cada despliegue.

```json
{
  "slug": "direccion-del-articulo",
  "status": "published",
  "title": "Título aprobado",
  "description": "Resumen concreto del contenido",
  "category": "Categoría",
  "author": "Equipo ROICAS",
  "published": "2026-10-26",
  "modified": "2026-10-26",
  "introduction": "Contexto y utilidad de la guía.",
  "sections": [{
    "heading": "Primera sección",
    "paragraphs": ["Explicación revisada."],
    "checklist": ["Una acción concreta"]
  }],
  "service": {"label": "Conocer el servicio", "href": "/servicios/tiendas-online"}
}
```

`npm run build` valida el contenido y genera página, listado y sitemap. El blog vacío lleva `noindex` y queda fuera del sitemap. Los enlaces de navegación al blog se activan cuando hay artículos publicados. Los borradores no tienen ruta pública.

Verificación: `npm test`, `npm run build`, `node scripts/check-seo.mjs`. Revisar diseño móvil, lectura, autoría y enlaces antes de publicar.

La referencia externa `seo-apis-that-rank-pages` se conserva fuera del proyecto. No se ejecutó ni se incorporó su código. Esta base no requiere nuevas API de pago.

## Siguiente etapa

1. Verificar la propiedad de dominio de Search Console y enviar `https://www.roicas.com/sitemap.xml`.
2. Comprobar indexación de servicios y rendimiento por consulta y página. Una propiedad nueva puede carecer de historial: no interpretar ausencia de datos como ausencia de demanda.
3. Investigar demanda y competencia en Colombia; asignar a cada servicio y artículo una intención distinta.
4. Preparar y revisar un piloto de artículos con ejemplos reales del equipo, preguntas de clientes y enlaces hacia los servicios pertinentes.
5. Medir clics orgánicos, consultas, solicitudes recibidas y conversiones; actualizar contenido a partir de resultados.
