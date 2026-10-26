export const SITE_URL = "https://www.roicas.com";
export const siteRoutes = ["/", "/servicios", "/servicios/diseno-web", "/servicios/tiendas-online", "/cotizar-tienda-online", "/servicios/seo", "/servicios/publicidad-digital", "/servicios/automatizacion-ia", "/nosotros", "/contacto", "/politica-privacidad"];
export function canonicalUrl(path: string) {
  return new URL(path, SITE_URL).href.replace(/^https:\/\/roicas\.com(?=\/|$)/, SITE_URL);
}
